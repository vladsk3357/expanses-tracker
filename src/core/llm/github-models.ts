type ChatMessage =
  | { role: "system" | "user" | "assistant"; content: string }
  | {
      role: "user";
      content: Array<
        | { type: "text"; text: string }
        | { type: "image_url"; image_url: { url: string } }
      >;
    };

function inferenceChatCompletionsUrl(): string {
  const org = process.env.GITHUB_MODELS_ORG?.trim();
  if (org) {
    return `https://models.github.ai/orgs/${encodeURIComponent(org)}/inference/chat/completions`;
  }
  return "https://models.github.ai/inference/chat/completions";
}

export async function githubModelsChatCompletion(options: {
  model: string;
  messages: ChatMessage[];
  responseFormat?: { type: "json_object" };
  temperature?: number;
  maxTokens?: number;
}): Promise<string> {
  const token = process.env.GITHUB_TOKEN?.trim();
  if (!token) {
    throw new Error(
      "Missing GITHUB_TOKEN. Create a fine-grained PAT with models:read and add it to .env.local.",
    );
  }

  const body: Record<string, unknown> = {
    model: options.model,
    messages: options.messages,
    stream: false,
    temperature: options.temperature ?? 0.2,
  };

  if (options.maxTokens != null) {
    body.max_tokens = options.maxTokens;
  }

  if (options.responseFormat) {
    body.response_format = options.responseFormat;
  }

  const res = await fetch(inferenceChatCompletionsUrl(), {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      accept: "application/vnd.github+json",
      "content-type": "application/json",
      "x-github-api-version": "2026-03-10",
    },
    body: JSON.stringify(body),
  });

  const rawText = await res.text();
  if (!res.ok) {
    throw new Error(
      `GitHub Models request failed (${res.status}): ${rawText.slice(0, 500)}`,
    );
  }

  const data = JSON.parse(rawText) as {
    choices?: Array<{ message?: { content?: string | null } }>;
  };
  const content = data.choices?.[0]?.message?.content;
  if (typeof content !== "string" || !content.trim()) {
    throw new Error("GitHub Models returned an empty completion.");
  }
  return content;
}
