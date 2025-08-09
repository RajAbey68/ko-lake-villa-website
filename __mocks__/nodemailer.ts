const createTransport = () => ({ sendMail: async () => ({ accepted: ['test@example.com'] }) });
export { createTransport };
export default { createTransport };