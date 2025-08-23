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
    },
    async seller(project, body) {
        let historialConversacion = [
            {
                role: 'system',
                content: `Eres un asistente de ventas, responde poco. no te explayes mucho, al inicio da la bienvenida a nuestra ferretería`,
              }
        ];
        const { getOpenAi } = require("../config/config");
        const openAi = getOpenAi(project)
        if (!body?.message) {
            return { error: 'El mensaje del usuario es requerido.' };
        }
        if (openAi) {
            const chat = await openAi.openAi.chat.completions.create({
                model: openAi.model,
                messages: historialConversacion,
                functions: [
                    {
                        name: "getProducts",
                        description: "Obtiene una lista de productos cuando el usuario pregunta",
                        parameters: {
                            type: "object",
                            properties: {
                                nameProduct: {
                                    type: "string",
                                    description: "El producto que desea conocer el usuario",
                                }
                            },
                            required: ["nameProduct"],
                        },
                    },
                  ],
                  function_call: "auto",
            });
            historialConversacion.push({ role: 'user', content: mensajeUsuario });
            const message = chat.choices[0].message;
            if (functionCall) {
                const { name, arguments: args } = message.function_call;
                if (functionCall.name === "getWeather") {
                    const { latitude, longitude } = JSON.parse(args);
                    const temperature = await getWeather(latitude, longitude);
                    return res.json({ respuesta: `La temperatura actual es ${temperature}°C` });
                }
                if (functionCall.name === "getProducts") {
                    const { nameProduct } = JSON.parse(functionCall.arguments);
                    const data = await getProducts(nameProduct);
                
                    // Devuelves esta "respuesta de herramienta" como parte del flujo de conversación:
                    const toolResponse = {
                        role: "function", // o "tool" según tu API
                        name: "getProducts",
                        content: JSON.stringify(data)
                    };
                
                    const nextMessages = [
                        ...historialConversacion,
                        message, // el mensaje del assistant que hizo la función
                        toolResponse
                    ];
                
                    // Enviar nuevamente a la API para que el modelo dé la respuesta final
                    const finalResponse = await openai.chat.completions.create({
                        model: model,
                        messages: nextMessages
                    });
                
                    // Ahora la respuesta final tendrá: "Sí, tengo PINTURA SPRAY C&A NEGRO MATE."
                    return { respuesta: finalResponse.choices[0].message.content };
                }
            }

            return { response: message.content }
        }
        return { error: 'No se pudo instanciar openAi' };
    }
}