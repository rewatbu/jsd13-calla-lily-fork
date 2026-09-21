const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const DEFAULT_MODEL = 'gemini-2.5-flash';
const MAX_HISTORY_MESSAGES = 16;
const MAX_MESSAGE_LENGTH = 2000;

const systemInstruction = {
  parts: [
    {
      text:
        'คุณคือ Calla AI ผู้ช่วยของร้าน Calla Lily ตอบลูกค้าด้วยภาษาไทยที่สุภาพ กระชับ และเป็นกันเอง ช่วยแนะนำสินค้าดูแลผิว วิธีใช้ และขั้นตอนสั่งซื้อได้ หากไม่ทราบข้อมูลเฉพาะของร้าน ให้บอกตรง ๆ และแนะนำให้ตรวจสอบกับร้าน ห้ามแต่งข้อมูลเรื่องราคา สต็อก โปรโมชั่น หรือสถานะคำสั่งซื้อ',
    },
  ],
};

const getClientMessages = (messages) => {
  if (!Array.isArray(messages)) return [];

  const contents = messages
    .slice(-MAX_HISTORY_MESSAGES)
    .filter(
      (message) =>
        message &&
        (message.role === 'user' || message.role === 'model') &&
        typeof message.text === 'string' &&
        message.text.trim(),
    )
    .map((message) => ({
      role: message.role,
      parts: [{ text: message.text.trim().slice(0, MAX_MESSAGE_LENGTH) }],
    }));

  // Gemini chat history must start with a user turn. The client displays a
  // welcome bubble before any customer message, so omit that display-only turn.
  const firstUserTurn = contents.findIndex((message) => message.role === 'user');
  return firstUserTurn === -1 ? [] : contents.slice(firstUserTurn);
};

const chat = async (req, res) => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    res.status(503).json({
      message: 'AI chat is not configured. Please add GEMINI_API_KEY to the server environment.',
    });
    return;
  }

  const contents = getClientMessages(req.body?.messages);
  if (!contents.length || contents.at(-1).role !== 'user') {
    res.status(400).json({ message: 'Please send a message for the assistant.' });
    return;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 25_000);

  try {
    const model = process.env.GEMINI_MODEL || DEFAULT_MODEL;
    const response = await fetch(`${GEMINI_API_URL}/${model}:generateContent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      signal: controller.signal,
      body: JSON.stringify({
        systemInstruction,
        contents,
        generationConfig: { temperature: 0.5, maxOutputTokens: 700 },
      }),
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      console.error('Gemini API error:', response.status, data?.error?.message);
      res.status(response.status === 429 ? 429 : 502).json({
        message:
          response.status === 429
            ? 'AI is busy right now. Please try again in a moment.'
            : 'The AI service could not answer right now. Please try again.',
      });
      return;
    }

    const reply = data?.candidates?.[0]?.content?.parts
      ?.map((part) => part.text || '')
      .join('')
      .trim();
    if (!reply) {
      res.status(502).json({ message: 'The AI service returned an empty response. Please try again.' });
      return;
    }

    res.json({ reply });
  } catch (error) {
    console.error('Gemini request failed:', error?.message);
    res.status(error?.name === 'AbortError' ? 504 : 502).json({
      message: 'The AI service is temporarily unavailable. Please try again.',
    });
  } finally {
    clearTimeout(timeout);
  }
};

export { chat };
