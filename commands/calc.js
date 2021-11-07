module.exports = {
    requiredParams: {
        q: 'Математическое выражение для вычисления'
    },
    handler: async (params) => {
        const { q: example } = params

        console.log(example)

        return example
    }
}
