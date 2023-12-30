const dropZone = document.getElementById('drop-zone')

dropZone?.addEventListener('dragover', (ev) => {
    ev.preventDefault()
    if (lefutott) {
        location.reload()
    }
})

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
                        workers[line.split(' ')[0].slice(1)] = []
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

interface munkács {
    [key: string]: Worker[]
}

let workerNum = 5
let hivasszam = 2000
let workers: munkács = {}

document.getElementById('alertbox')?.addEventListener('click', (ev) => {
    ev.preventDefault()
    document.getElementById('alertbox')?.classList.add('hidden')
})

async function SCKK(logs: string[]) {
    document.getElementById('loadhelp')?.classList.remove('!hidden')
    document.getElementById('draghelp')?.classList.add('hidden')
    if (dates.length > 1) {
        fo['Összesen'] = {
            emberek: {},
            lemondott: 0,
            egyperces: 0,
        }
    }
    for (const nap in fo) {
        if (nap !== 'Összesen') {
            for (let i = 0; i < workerNum; i++) {
                const worker = new Worker('worker.js', { type: 'module' })
                workers[nap].push(worker)
                worker.postMessage({
                    logs: logs,
                    nap: nap,
                    hanyszor: hivasszam / workerNum,
                    start: (hivasszam / workerNum) * i,
                    dates: dates,
                })
                worker.onmessage = (ev) => {
                    worker.terminate()
                    workers[ev.data.nap].splice(
                        workers[ev.data.nap].indexOf(worker),
                        1
                    )
                    if (Object.keys(ev.data.fo.emberek).length > 1) {
                        fo[ev.data.nap].lemondott += ev.data.fo.lemondott
                        fo[ev.data.nap].egyperces += ev.data.fo.egyperces
                        for (const ember in ev.data.fo.emberek) {
                            if (fo[ev.data.nap].emberek[ember]) {
                                fo[ev.data.nap].emberek[ember].műszak +=
                                    ev.data.fo.emberek[ember].műszak
                                fo[ev.data.nap].emberek[ember].összesen +=
                                    ev.data.fo.emberek[ember].összesen
                            } else {
                                fo[ev.data.nap].emberek[ember] = {
                                    műszak: ev.data.fo.emberek[ember].műszak,
                                    összesen:
                                        ev.data.fo.emberek[ember].összesen,
                                }
                            }
                        }
                        if (dates.length > 1) {
                            fo['Összesen'].lemondott +=
                                ev.data.fo.Összesen.lemondott
                            fo['Összesen'].egyperces +=
                                ev.data.fo.Összesen.egyperces
                        }
                        for (const ember in ev.data.fo.Összesen.emberek) {
                            if (fo['Összesen'].emberek[ember]) {
                                fo['Összesen'].emberek[ember].műszak +=
                                    ev.data.fo.Összesen.emberek[ember].műszak
                                fo['Összesen'].emberek[ember].összesen +=
                                    ev.data.fo.Összesen.emberek[ember].összesen
                            } else {
                                fo['Összesen'].emberek[ember] = {
                                    műszak: ev.data.fo.Összesen.emberek[ember]
                                        .műszak,
                                    összesen:
                                        ev.data.fo.Összesen.emberek[ember]
                                            .összesen,
                                }
                            }
                        }
                        console.log(fo)
                        doneReturn()
                    }
                }
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 0))
    }
}

let doneReturnCount = 0
function doneReturn() {
    doneReturnCount++
    if (doneReturnCount === dates.length) {
        for (const manas in fo) {
            if (manas !== 'Összesen') {
                handleReturn(manas)
            } else {
                if (dates.length > 1) {
                    handleReturn(manas)
                }
            }
        }
    }
}

function handleReturn(nap: string) {
    console.log(nap, '- Kész')
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
