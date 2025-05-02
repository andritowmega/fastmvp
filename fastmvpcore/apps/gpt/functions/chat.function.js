module.exports = {
    async chat(project, body) {
        const { getOpenAi } = require("../config/config");
        const openAi = getOpenAi(project)
        if (!body?.message) {
            return { error: 'El mensaje del usuario es requerido.' };
        }
        if (openAi) {
            const chat = await openAi.openAi.chat.completions.create({
                model: openAi.model,
                messages: [
                    { role: 'system', content: 'Eres un asistente útil.' },
                    { role: 'user', content: body.message },
                ],
            });
            const message = chat.choices[0].message;
            return { response: message.content }
        }
        return { error: 'No se pudo instanciar openAi' };
    }
}