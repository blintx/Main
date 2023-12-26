module.exports = {
    apps: [
        {
            name: 'ampix-main',
            script: './dist/index.js',
            // instances: 4,
            // exec_mode: 'cluster',
            watch: false,
        },
    ],
}
