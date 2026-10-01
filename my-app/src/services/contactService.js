export const sendContactMessage = async ({ name, email, message }) => {
  const messages = JSON.parse(localStorage.getItem("furniture_contact_messages") || "[]");
  messages.unshift({ id: Date.now(), name, email, message, date: new Date().toISOString() });
  localStorage.setItem("furniture_contact_messages", JSON.stringify(messages));
  return { message: "Your message has been saved successfully." };
};
