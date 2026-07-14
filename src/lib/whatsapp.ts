export function whatsappUrl(value: string, message = "Hi Zabir, I want to talk about a project.") {
  if (value.startsWith("http")) {
    const url = new URL(value);

    if (!url.searchParams.has("text")) {
      url.searchParams.set("text", message);
    }

    return url.toString();
  }

  const digits = value.replace(/\D/g, "");
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`;
}
