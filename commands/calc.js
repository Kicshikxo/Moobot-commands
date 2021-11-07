module.exports = {
    requiredParams: {
        q: 'Математическое выражение для вычисления'
    },
    handler: async (params) => {
        const { q: example } = params

        return JSON.stringify(await eval(example) || '')
    }
}
