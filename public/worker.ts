// worker.js
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

let akezdet = new Date().setHours(15, 0, 0, 0)
let avege = new Date().setHours(18, 30, 0, 0)

self.onmessage = function (e) {
    var result = calcCall(e.data.cycle, e.data.logs, e.data.nap, e.data.dates)
    self.postMessage(result)
}

function calcCall(i: number, logs: string[], nap: string, dates: string[]) {
    const tesztmama = logs.findLastIndex(
        (element) =>
            element.startsWith('[' + nap) &&
            element.endsWith('Új hívás érkezett: ' + i)
    )
    const index = logs.findLastIndex(
        (element) =>
            element.startsWith('[' + nap) &&
            element.endsWith('TAXI elfogadta a következő hívást: ' + i)
    )
    if (tesztmama !== -1 || index !== -1) {
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
                    if (akezdet < most && most < avege) {
                        self.postMessage({
                            msg: 'addManMuszak',
                            name: cuccman,
                        })
                    } else {
                        self.postMessage({
                            msg: 'addManAll',
                            name: cuccman,
                        })
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
                        element.includes('Törlődött a következő hívás: ' + i) &&
                        element.endsWith('TAXI törölte)')
                )
                const elfogadva = logs.findLastIndex(
                    (element) =>
                        element.startsWith('[' + nap) &&
                        element.endsWith(
                            'TAXI elfogadta a következő hívást: ' + i
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
                        self.postMessage({
                            msg: 'addNapPerces',
                        })
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
                                'TAXI elfogadta a következő hívást: ' + i
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
                            self.postMessage({ msg: 'addNapLemondott' })
                        }
                    }
                }
            }
        }
    }
}
