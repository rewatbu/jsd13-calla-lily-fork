import { useRef, useState } from "react";
import { api } from "../api";

const welcomeMessage = {
  role: "model",
  text: "สวัสดีค่ะ ฉันคือ Calla AI มีอะไรให้ช่วยแนะนำเกี่ยวกับสินค้าได้บ้างคะ?",
};

export default function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([welcomeMessage]);
  const [draft, setDraft] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const openChat = () => {
    setIsOpen(true);
    window.setTimeout(() => inputRef.current?.focus(), 0);
  };

  const sendMessage = async (event) => {
    event.preventDefault();
    const text = draft.trim();
    if (!text || isSending) return;

    const nextMessages = [...messages, { role: "user", text }];
    setMessages(nextMessages);
    setDraft("");
    setError("");
    setIsSending(true);

    try {
      const { reply } = await api.chat(nextMessages);
      setMessages((current) => [...current, { role: "model", text: reply }]);
    } catch (requestError) {
      setError(requestError.message || "ส่งข้อความไม่สำเร็จ กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsSending(false);
      window.setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <div className="fixed bottom-5 right-4 sm:bottom-6 sm:right-6 z-50">
      {isOpen && (
        <section
          aria-label="Calla AI chat"
          className="mb-3 flex h-[min(34rem,calc(100vh-7rem))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-surface shadow-brand-md"
        >
          <header className="flex items-center justify-between bg-primary px-4 py-3 text-background">
            <div>
              <h2 className="font-bold">Calla AI</h2>
              <p className="text-xs text-background/80">ผู้ช่วยแนะนำผลิตภัณฑ์</p>
            </div>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close AI chat"
              className="flex h-9 w-9 items-center justify-center rounded-lg text-xl hover:bg-surface/15"
            >
              ×
            </button>
          </header>

          <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`max-w-[88%] whitespace-pre-wrap rounded-2xl px-3 py-2 text-sm leading-relaxed ${
                  message.role === "user"
                    ? "ml-auto bg-primary text-background"
                    : "bg-background text-foreground"
                }`}
              >
                {message.text}
              </div>
            ))}
            {isSending && (
              <div className="w-fit rounded-2xl bg-background px-3 py-2 text-sm text-muted-foreground">
                Calla AI กำลังพิมพ์...
              </div>
            )}
          </div>

          <form onSubmit={sendMessage} className="border-t border-border p-3">
            {error && <p className="mb-2 text-xs text-danger">{error}</p>}
            <div className="flex gap-2">
              <input
                ref={inputRef}
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                maxLength={2000}
                disabled={isSending}
                placeholder="พิมพ์ข้อความ..."
                aria-label="Message for Calla AI"
                className="min-w-0 flex-1 rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-primary disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={!draft.trim() || isSending}
                className="rounded-xl bg-primary px-3 text-sm font-semibold text-background transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:bg-border disabled:text-muted-foreground"
              >
                ส่ง
              </button>
            </div>
          </form>
        </section>
      )}

      <button
        type="button"
        onClick={isOpen ? () => setIsOpen(false) : openChat}
        aria-label={isOpen ? "Close AI chat" : "Open AI chat"}
        aria-expanded={isOpen}
        className="ml-auto flex h-14 items-center gap-2 rounded-full bg-muted-foreground px-5 text-sm font-bold text-background shadow-brand-md transition-all hover:-translate-y-0.5 hover:bg-primary-hover focus-visible:outline-3 focus-visible:outline-offset-3 focus-visible:outline-border"
      >
        <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M8 10h.01M12 10h.01M16 10h.01M21 12c0 4.418-4.03 8-9 8a9.77 9.77 0 0 1-4.4-1.04L3 20l1.3-3.25A7.6 7.6 0 0 1 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8Z" />
        </svg>
        AI ช่วยแนะนำ
      </button>
    </div>
  );
}
