const dropZone = document.getElementById('drop-zone')
let returner = document.getElementById('returner')

dropZone?.addEventListener('dragover', (ev) => {
    ev.preventDefault()
    if (lefutott) {
        location.reload()
    }
})

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
    'Nick',
    'Derion',
    'Chris',
]

let akezdet = new Date().setHours(15, 0, 0, 0)
let avege = new Date().setHours(18, 30, 0, 0)

interface ember {
    műszak: number
    összesen: number
}

interface emberjson {
    [key: string]: ember
}

interface muszak {
    emberek: emberjson
    lemondott: number
    egyperces: number
}

interface jani {
    [key: string]: muszak
}

let fo: jani = {}

let lefutott = false

let dates: string[] = []

dropZone?.addEventListener('drop', (ev) => {
    ev.preventDefault()
    lefutott = true
    let logs: string[] = []
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
                if (line.split(' ')[0].slice(1) !== '') {
                    if (!fo[line.split(' ')[0].slice(1)]) {
                        fo[line.split(' ')[0].slice(1)] = {
                            emberek: {},
                            lemondott: 0,
                            egyperces: 0,
                        }
                        dates.push(line.split(' ')[0].slice(1))
                    }
                }
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

document.getElementById('alertbox')?.addEventListener('click', (ev) => {
    ev.preventDefault()
    document.getElementById('alertbox')?.classList.add('hidden')
})

function SCKK(logs: string[]) {
    document.getElementById('loadhelp')?.classList.remove('!hidden')
    document.getElementById('draghelp')?.classList.add('hidden')
    if (dates.length > 1) {
        fo['Összesen'] = {
            emberek: {},
            lemondott: 0,
            egyperces: 0,
        }
    }
    setTimeout(() => {
        for (const nap in fo) {
            if (nap !== 'Összesen') {
                for (let i = 1; i < 2000; i++) {
                    const tesztmama = logs.findLastIndex(
                        (element) =>
                            element.startsWith('[' + nap) &&
                            element.endsWith('Új hívás érkezett: ' + i)
                    )
                    const index = logs.findLastIndex(
                        (element) =>
                            element.startsWith('[' + nap) &&
                            element.endsWith(
                                'TAXI elfogadta a következő hívást: ' + i
                            )
                    )
                    if (tesztmama !== -1 || index !== -1) {
                        if (index !== -1) {
                            let most = new Date().setHours(
                                Number(
                                    logs[index]
                                        .split(' ')[1]
                                        .slice(undefined, -1)
                                        .split(':')[0]
                                ),
                                Number(
                                    logs[index]
                                        .split(' ')[1]
                                        .slice(undefined, -1)
                                        .split(':')[1]
                                ),
                                Number(
                                    logs[index]
                                        .split(' ')[1]
                                        .slice(undefined, -1)
                                        .split(':')[2]
                                ),
                                0
                            )
                            let cuccman = logs[index]
                                .split(':')[4]
                                .split('/')[0]
                                .slice(1, -1)
                            if (cuccman !== 'senki') {
                                if (fo[nap].emberek[cuccman]) {
                                    if (akezdet < most && most < avege) {
                                        fo[nap].emberek[cuccman].összesen++
                                        fo[nap].emberek[cuccman].műszak++
                                    } else {
                                        fo[nap].emberek[cuccman].összesen++
                                    }
                                } else {
                                    if (akezdet < most && most < avege) {
                                        fo[nap].emberek[cuccman] = {
                                            műszak: 1,
                                            összesen: 1,
                                        }
                                    } else {
                                        fo[nap].emberek[cuccman] = {
                                            műszak: 0,
                                            összesen: 1,
                                        }
                                    }
                                }
                                if (dates.length > 1) {
                                    if (fo['Összesen'].emberek[cuccman]) {
                                        if (akezdet < most && most < avege) {
                                            fo['Összesen'].emberek[cuccman]
                                                .összesen++
                                            fo['Összesen'].emberek[cuccman]
                                                .műszak++
                                        } else {
                                            fo['Összesen'].emberek[cuccman]
                                                .összesen++
                                        }
                                    } else {
                                        if (akezdet < most && most < avege) {
                                            fo['Összesen'].emberek[cuccman] = {
                                                műszak: 1,
                                                összesen: 1,
                                            }
                                        } else {
                                            fo['Összesen'].emberek[cuccman] = {
                                                műszak: 0,
                                                összesen: 1,
                                            }
                                        }
                                    }
                                }
                            }
                        } else {
                            const ujhivas = logs.findLastIndex(
                                (element) =>
                                    element.startsWith('[' + nap) &&
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
                                        element.startsWith('[' + nap) &&
                                        element.includes(
                                            'Törlődött a következő hívás: ' + i
                                        ) &&
                                        element.endsWith('TAXI törölte)')
                                )
                                const elfogadva = logs.findLastIndex(
                                    (element) =>
                                        element.startsWith('[' + nap) &&
                                        element.endsWith(
                                            'TAXI elfogadta a következő hívást: ' +
                                                i
                                        )
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
                                        fo[nap].egyperces++
                                        if (dates.length > 1) {
                                            fo['Összesen'].egyperces++
                                        }
                                    }
                                } else {
                                    const lemondott = logs.findLastIndex(
                                        (element) =>
                                            element.startsWith('[' + nap) &&
                                            element.includes(
                                                'Törlődött a következő hívás: ' +
                                                    i +
                                                    ' (lemondta a játékos)'
                                            )
                                    )
                                    const lemondott2 = logs.findLastIndex(
                                        (element) =>
                                            element.startsWith('[' + nap) &&
                                            element.endsWith(
                                                'TAXI elfogadta a következő hívást: ' +
                                                    i
                                            )
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
                                            fo[nap].lemondott++
                                            if (dates.length > 1) {
                                                fo['Összesen'].lemondott++
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                handleReturn(nap)
            }
        }
        if (dates.length > 1) {
            handleReturn('Összesen')
        }
    }, 100)
}

function handleReturn(nap: string) {
    document.getElementById('loadhelp')?.classList.add('!hidden')
    const napok = document.getElementById('napok')
    const ezanap = document.createElement('div')
    ezanap.id = nap
    napok?.appendChild(ezanap)
    const napcim = document.createElement('h1')
    napcim.innerText = nap
    napcim.classList.add(
        'font-semibold',
        'text-xl',
        'my-2',
        'bg-gray-900',
        '-mx-10'
    )
    ezanap.appendChild(napcim)
    const muszakcim = document.createElement('h2')
    muszakcim.innerText = 'A műszak'
    muszakcim.classList.add('font-semibold', 'mb-2', 'text-lg')
    ezanap.appendChild(muszakcim)
    const amuszak = document.createElement('div')
    for (const data in fo[nap].emberek) {
        const item = document.createElement('h2')
        item.innerText =
            '- ' + data.split(' ')[0] + ': ' + fo[nap].emberek[data].műszak
        amuszak?.appendChild(item)
    }
    amuszak?.lastElementChild?.classList.add('mb-5')
    ezanap.appendChild(amuszak)
    const lemondott = document.createElement('h2')
    lemondott.innerText = '- Lemondott: ' + fo[nap].lemondott
    amuszak?.appendChild(lemondott)
    const egyperces = document.createElement('h2')
    egyperces.innerText = '- 1 perces: ' + fo[nap].egyperces
    egyperces.classList.add('mb-5')
    amuszak?.appendChild(egyperces)
    const osszescim = document.createElement('h2')
    osszescim.innerText = 'Összesen'
    osszescim.classList.add('font-semibold', 'mb-2', 'text-lg')
    ezanap.appendChild(osszescim)
    const osszes = document.createElement('div')
    for (const data in fo[nap].emberek) {
        if (tagok.includes(data.split(' ')[0])) {
            const item = document.createElement('h2')
            item.innerText =
                '- ' +
                data.split(' ')[0] +
                ': ' +
                fo[nap].emberek[data].összesen
            osszes?.appendChild(item)
        }
    }
    ezanap.appendChild(osszes)
}
