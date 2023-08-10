import { RiBusinessSendPlane2Fill } from "solid-icons/ri";
import { createSignal } from "solid-js";
import { TemporalAssistantMessage } from "./dashboard.types";

export default function Assistant() {
  const [assistantMessages, setAssistantMessages] = createSignal<
    TemporalAssistantMessage[]
  >([
    {
      content: "Hi! I'm your assistant. How can I help you?",
      type: "success",
      timestamp: Date.now(),
      sender: "assistant",
    },
    {
      content:
        'P.S. You can ask me something like: "Take me to my calendar, viewing May" or "What were my last 3 transactions?"',
      type: "success",
      timestamp: Date.now() + 1,
      sender: "assistant",
    },
  ]);

  const sendMessage = () => {
    const element = document.getElementById(
      "assistant-message-input"
    ) as HTMLInputElement;
    setAssistantMessages([
      ...assistantMessages(),
      {
        content: element?.value,
        type: "success",
        timestamp: Date.now(),
        sender: "user",
      },
    ]);
    element.value = "";
  };

  return (
    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title">Ask Assistant</h2>
        <div class="assistant-window h-full">
          {assistantMessages()
            .sort((a, b) => a.timestamp - b.timestamp)
            .map((message) => (
              <div
                class={
                  message.sender === "assistant"
                    ? "chat chat-start"
                    : "chat chat-end"
                }
              >
                <div class="chat-bubble chat-bubble-primary">
                  {message.content}
                </div>
              </div>
            ))}
        </div>
        <div class="card-actions justify-center">
          <div class="form-control w-full">
            <div class="input-group">
              <input
                type="text"
                placeholder="Send a message…"
                class="input input-bordered w-full"
                id="assistant-message-input"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />
              <button
                class="btn btn-square"
                aria-label="Send question to assistant button"
                onClick={() => {
                  sendMessage();
                }}
                type="button"
              >
                <RiBusinessSendPlane2Fill size={24} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
