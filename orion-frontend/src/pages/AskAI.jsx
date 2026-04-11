import { useEffect, useRef, useState } from "react";
import { sendGeminiMessage } from "../services/api";
import "./AskAI.css";

const starterMessages = [
	{
		id: 1,
		role: "assistant",
		text: "Hi! I am Orion AI. Ask me anything about your spending, savings, or budget planning.",
		time: "09:41",
	}
];

const quickPrompts = [
	"Show my top 3 expense categories",
	"How close am I to my emergency fund goal?",
	"Give me a spending summary for the last 30 days",
];


export default function AskAI() {
	const [messages, setMessages] = useState(starterMessages);
	const [inputValue, setInputValue] = useState("");
	const [isSending, setIsSending] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const threadEndRef = useRef(null);

	const hasMessages = messages.length > 0;

	useEffect(() => {
		threadEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
	}, [messages]);

	const submitMessage = async (rawText) => {
		const cleanedText = rawText.trim();
		if (!cleanedText || isSending) {
			return;
		}

		setErrorMessage("");

		const userMessage = {
			id: Date.now(),
			role: "user",
			text: cleanedText,
		};

		setMessages((prev) => [...prev, userMessage]);
		setInputValue("");
		setIsSending(true);

		try {
			const responseText = await sendGeminiMessage(cleanedText);

			setMessages((prev) => [
				...prev,
				{
					id: Date.now() + 1,
					role: "assistant",
					text: responseText,
				},
			]);
		} catch (error) {
			const message = error instanceof Error ? error.message : "Unable to reach the AI service.";
			setErrorMessage(message);
			setMessages((prev) => [
				...prev,
				{
					id: Date.now() + 1,
					role: "assistant",
					text: "I could not fetch a response right now. Please try again.",
				},
			]);
		} finally {
			setIsSending(false);
		}
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		submitMessage(inputValue);
	};

	return (
		<div className="ask-ai-page">
			<header className="ask-ai-header panel">
				<div>
					<h1 className="ask-ai-title">Ask Orion AI</h1>
					<p className="ask-ai-subtitle">
						Chat about spending trends, savings goals, and household budget insights.
					</p>
				</div>
				<span className="ask-ai-status" aria-label="assistant status">
					<span className="ask-ai-status-dot" />
					Online
				</span>
			</header>

			<section className="ask-ai-chat panel" aria-label="Orion AI chat thread">
				<div className="ask-ai-thread" role="log" aria-live="polite" aria-relevant="additions">
					{hasMessages ? (
						messages.map((message) => (
							<article
								key={message.id}
								className={`chat-message chat-message-${message.role}`}
								aria-label={message.role === "assistant" ? "Orion AI message" : "Your message"}
							>
								<p className="chat-message-text">{message.text}</p>
							</article>
						))
					) : (
						<p className="chat-empty-state">Start by asking Orion AI a finance question.</p>
					)}
					{isSending && (
						<article className="chat-message chat-message-assistant">
							<p className="chat-message-typing" aria-label="Orion is typing">
								Orion is typing...
							</p>
						</article>
					)}
					<div ref={threadEndRef} />
				</div>

				{errorMessage ? (
					<p className="ask-ai-error" role="alert">
						{errorMessage}
					</p>
				) : null}

				<div className="quick-prompts" aria-label="suggested prompts">
					{quickPrompts.map((prompt) => (
						<button
							key={prompt}
							type="button"
							className="quick-prompt-btn"
							onClick={() => submitMessage(prompt)}
							disabled={isSending}
						>
							{prompt}
						</button>
					))}
				</div>

				<form className="ask-ai-composer" onSubmit={handleSubmit}>
					<label htmlFor="ask-ai-input" className="sr-only">
						Type your message to Orion AI
					</label>
					<input
						id="ask-ai-input"
						type="text"
						autoComplete="off"
						placeholder="Type a message..."
						value={inputValue}
						onChange={(event) => setInputValue(event.target.value)}
						className="ask-ai-input"
						disabled={isSending}
					/>
					<button
						type="submit"
						className="ask-ai-send"
						disabled={!inputValue.trim() || isSending}
					>
						Send
					</button>
				</form>
			</section>
		</div>
	);
}
