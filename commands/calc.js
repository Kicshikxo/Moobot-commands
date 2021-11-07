module.exports = {
    requiredParams: {
        q: 'Математическое выражение для вычисления'
    },
    handler: async (params) => {
        const { q: example } = params
        if (!example) {
            return "Введите пример. Например '2+2' или '123 **3 - 123456/ 2'"
        }

        return JSON.stringify(await eval(example) || '').replace(/^\"+|\"+$/g, '')
    }
}
