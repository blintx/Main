const dropZone = document.getElementById('drop-zone')
let returner = document.getElementById('returner')

dropZone?.addEventListener('dragover', (ev) => {
    ev.preventDefault()
})

let akezdet = new Date().setHours(15, 0, 0, 0)
let avege = new Date().setHours(18, 30, 0, 0)

let returnerarray: string[] = []

const tagok = [
    'Kevin',
    'Danelson',
    'Meier',
    'Edgar',
    'Lucas',
    'Lisa',
    'Bryan',
    'Windsor',
    'Jackson',
    'Jadon',
    'Demyan',
    'Cristobal',
    'Bill',
    'Jakob',
    'Marco',
]

interface ember {
    műszak: number
    összesen: number
}

interface emberjson {
    [key: string]: ember
}

let elfogadott: { elfogadó: string; szám: number }[] = []
let fo: {
    emberek: emberjson
    lemondott: number
    egyperces: number
} = {
    emberek: {},
    lemondott: 0,
    egyperces: 0,
}

dropZone?.addEventListener('drop', (ev) => {
    let logs: string[] = []
    ev.preventDefault()
    let fiels = ev.dataTransfer?.files.length
    let filesProcessed = 0
    for (const file of ev.dataTransfer!.files) {
        const reader = new FileReader()

        reader.onload = function (event) {
            const fileContent = event.target?.result

            // Split the file content into lines
            const lines = fileContent?.toString().split('\n')

            // Push each line into the logs array
            lines?.forEach((line) => {
                logs.push(line.trim()) // Trim to remove leading/trailing whitespaces
            })

            filesProcessed++

            // Check if all files have been processed before making the fetch request
            if (filesProcessed === fiels) {
                // All files have been processed, make the fetch request here
                SCKK(logs)
            }
        }

        reader.readAsText(file)
    }
})

function SCKK(logs: string[]) {
    document.getElementById('title')!.classList.add('hidden')
    document.getElementById('draghelp')!.classList.add('hidden')
    document.getElementById('loadhelp')!.classList.remove('hidden')
    for (let i = 1; i < 2000; i++) {
        elfogadott.push({
            elfogadó: 'senki',
            szám: i,
        })
        const index = logs.findLastIndex((element) =>
            new RegExp(`elfogadta a következő hívást: ${i}$`).test(element)
        )

        if (index !== -1) {
            let most = new Date().setHours(
                Number(
                    logs[index].split(' ')[1].slice(undefined, -1).split(':')[0]
                ),
                Number(
                    logs[index].split(' ')[1].slice(undefined, -1).split(':')[1]
                ),
                Number(
                    logs[index].split(' ')[1].slice(undefined, -1).split(':')[2]
                ),
                0
            )
            let cuccman = logs[index].split(':')[4].split('/')[0].slice(1, -1)
            if (cuccman !== 'senki') {
                if (tagok.includes(cuccman.split(' ')[0])) {
                    if (fo.emberek[cuccman]) {
                        if (akezdet < most && most < avege) {
                            fo.emberek[cuccman].összesen++
                            fo.emberek[cuccman].műszak++
                        } else {
                            fo.emberek[cuccman].összesen++
                        }
                    } else {
                        if (akezdet < most && most < avege) {
                            fo.emberek[cuccman] = { műszak: 1, összesen: 1 }
                        } else {
                            fo.emberek[cuccman] = { műszak: 0, összesen: 1 }
                        }
                    }
                }
            }
        }
        const lemondott = logs.findLastIndex((element) =>
            element.includes(
                'Törlődött a következő hívás: ' + i + ' (lemondta a játékos)'
            )
        )
        const lemondott2 = logs.findLastIndex((element) =>
            element.endsWith('TAXI elfogadta a következő hívást: ' + i)
        )
        if (lemondott !== -1 && lemondott2 == -1) {
            let most = new Date().setHours(
                Number(
                    logs[lemondott]
                        .split(' ')[1]
                        .slice(undefined, -1)
                        .split(':')[0]
                ),
                Number(
                    logs[lemondott]
                        .split(' ')[1]
                        .slice(undefined, -1)
                        .split(':')[1]
                ),
                Number(
                    logs[lemondott]
                        .split(' ')[1]
                        .slice(undefined, -1)
                        .split(':')[2]
                ),
                0
            )
            if (akezdet < most && most < avege) {
                fo.lemondott++
            }
        }
        const ujhivas = logs.findLastIndex((element) =>
            element.endsWith('Új hívás érkezett: ' + i)
        )
        if (ujhivas !== -1) {
            let most = new Date().setHours(
                Number(
                    logs[ujhivas]
                        .split(' ')[1]
                        .slice(undefined, -1)
                        .split(':')[0]
                ),
                Number(
                    logs[ujhivas]
                        .split(' ')[1]
                        .slice(undefined, -1)
                        .split(':')[1]
                ),
                Number(
                    logs[ujhivas]
                        .split(' ')[1]
                        .slice(undefined, -1)
                        .split(':')[2]
                ),
                0
            )
            const torolve = logs.findLastIndex(
                (element) =>
                    element.includes('Törlődött a következő hívás: ' + i) &&
                    element.endsWith('TAXI törölte)')
            )
            const elfogadva = logs.findLastIndex((element) =>
                element.endsWith('TAXI elfogadta a következő hívást: ' + i)
            )
            if (torolve !== -1 && elfogadva === -1) {
                let elf = new Date().setHours(
                    Number(
                        logs[torolve]
                            .split(' ')[1]
                            .slice(undefined, -1)
                            .split(':')[0]
                    ),
                    Number(
                        logs[torolve]
                            .split(' ')[1]
                            .slice(undefined, -1)
                            .split(':')[1]
                    ),
                    Number(
                        logs[torolve]
                            .split(' ')[1]
                            .slice(undefined, -1)
                            .split(':')[2]
                    ),
                    0
                )
                if (most - elf <= 60000) {
                    fo.egyperces++
                }
            }
        }
    }
    console.log(fo)
    returnerarray = []
    returnerarray.push(
        `Mai nap (${new Date().getFullYear()}.${new Date().getMonth()}.${new Date().getDate()}.)`
    )
    returnerarray.push('<@&1117769320534134866>')
    returnerarray.push('')
    for (const val in fo.emberek) {
        if (fo.emberek[val].műszak > 0) {
            returnerarray.push(
                val.split(' ')[0] + ' - ' + fo.emberek[val].műszak
            )
        }
    }
    returnerarray.push('')
    returnerarray.push('1 perces - ' + fo.egyperces)
    returnerarray.push('Lemondott - ' + fo.lemondott)
    returnerarray.push('')
    returnerarray.push('Heti statisztika így néz ki jelenleg:')
    returnerarray.push('')
    for (const val in fo.emberek) {
        if (fo.emberek[val].összesen > 0) {
            returnerarray.push(
                val.split(' ')[0] + ' - ' + fo.emberek[val].összesen
            )
        }
    }
    returnerarray.push('')
    returnerarray.push(
        'Az üzenetre kérlek reagáljatok annak függvényében, hogy holnap jelen tudtok-e lenni csapatidőbe. Köszi!'
    )
    handleReturn()
}

function handleReturn() {
    while (returner?.firstChild) {
        returner.removeChild(returner.lastChild!)
    }

    returnerarray.forEach((val) => {
        let h2 = document.createElement('h2')
        if (val === '') {
            h2.innerText = '-'
        } else {
            h2.innerText = val
        }
        returner?.appendChild(h2)
    })
    document.getElementById('loadhelp')?.classList.add('hidden')
    document.getElementById('title')?.classList.remove('hidden')
    document.getElementById('amuszak-title')?.classList.remove('hidden')
    document.getElementById('all-title')?.classList.remove('hidden')
    const amuszak = document.getElementById('amuszak')
    for (const data in fo.emberek) {
        const item = document.createElement('h2')
        item.innerText = data + ' - ' + fo.emberek[data].műszak
        amuszak?.appendChild(item)
    }
    amuszak?.lastElementChild?.classList.add('mb-5')
    const lemondott = document.createElement('h2')
    lemondott.innerText = 'Lemondott - ' + fo.lemondott
    amuszak?.appendChild(lemondott)
    const egyperces = document.createElement('h2')
    egyperces.innerText = '1 perces - ' + fo.egyperces
    egyperces.classList.add('mb-5')
    amuszak?.appendChild(egyperces)
    const osszes = document.getElementById('all')
    for (const data in fo.emberek) {
        const item = document.createElement('h2')
        item.innerText = data + ' - ' + fo.emberek[data].összesen
        osszes?.appendChild(item)
    }
}
