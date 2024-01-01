interface jonas extends MessageEvent<any> {
    data: {
        logs: string[]
        nap: string
        hanyszor: number
        start: number
        dates: string[]
    }
}

let akezdet = new Date().setHours(15, 0, 0, 0)
let avege = new Date().setHours(18, 30, 0, 0)
let bvege = new Date().setHours(22, 0, 0, 0)

interface ember {
    műszak: number
    összesen: number
}

interface emberjson {
    [key: string]: ember
}

interface all {
    emberek: emberjson
    lemondott: number
    egyperces: number
}

interface muszak {
    emberek: emberjson
    lemondott: number
    egyperces: number
    Összesen: all
}

let fo: muszak = {
    emberek: {},
    lemondott: 0,
    egyperces: 0,
    Összesen: {
        emberek: {},
        lemondott: 0,
        egyperces: 0,
    },
}

onmessage = async (ev: jonas) => {
    for (let i = ev.data.start; i < ev.data.hanyszor + ev.data.start; i++) {
        const tesztmama = ev.data.logs.findLastIndex(
            (element) =>
                element.startsWith('[' + ev.data.nap) &&
                element.endsWith('Új hívás érkezett: ' + i)
        )
        const index = ev.data.logs.findLastIndex(
            (element) =>
                element.startsWith('[' + ev.data.nap) &&
                element.endsWith('TAXI elfogadta a következő hívást: ' + i)
        )
        if (tesztmama !== -1 || index !== -1) {
            if (index !== -1) {
                let most = new Date().setHours(
                    Number(
                        ev.data.logs[index]
                            .split(' ')[1]
                            .slice(undefined, -1)
                            .split(':')[0]
                    ),
                    Number(
                        ev.data.logs[index]
                            .split(' ')[1]
                            .slice(undefined, -1)
                            .split(':')[1]
                    ),
                    Number(
                        ev.data.logs[index]
                            .split(' ')[1]
                            .slice(undefined, -1)
                            .split(':')[2]
                    ),
                    0
                )
                let cuccman = ev.data.logs[index]
                    .split(':')[4]
                    .split('/')[0]
                    .slice(1, -1)
                if (cuccman !== 'senki') {
                    if (fo.emberek[cuccman]) {
                        if (akezdet < most && most < avege) {
                            fo.emberek[cuccman].összesen++
                            fo.emberek[cuccman].műszak++
                        } else if (most > avege && bvege > most) {
                            fo.emberek[cuccman].összesen++
                        }
                    } else {
                        if (akezdet < most && most < avege) {
                            fo.emberek[cuccman] = {
                                műszak: 1,
                                összesen: 1,
                            }
                        } else if (most > avege && bvege > most) {
                            fo.emberek[cuccman] = {
                                műszak: 0,
                                összesen: 1,
                            }
                        }
                    }
                    if (ev.data.dates.length > 1) {
                        if (fo['Összesen'].emberek[cuccman]) {
                            if (akezdet < most && most < avege) {
                                fo['Összesen'].emberek[cuccman].összesen++
                                fo['Összesen'].emberek[cuccman].műszak++
                            } else {
                                fo['Összesen'].emberek[cuccman].összesen++
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
                const ujhivas = ev.data.logs.findLastIndex(
                    (element) =>
                        element.startsWith('[' + ev.data.nap) &&
                        element.endsWith('Új hívás érkezett: ' + i)
                )
                if (ujhivas !== -1) {
                    let most = new Date().setHours(
                        Number(
                            ev.data.logs[ujhivas]
                                .split(' ')[1]
                                .slice(undefined, -1)
                                .split(':')[0]
                        ),
                        Number(
                            ev.data.logs[ujhivas]
                                .split(' ')[1]
                                .slice(undefined, -1)
                                .split(':')[1]
                        ),
                        Number(
                            ev.data.logs[ujhivas]
                                .split(' ')[1]
                                .slice(undefined, -1)
                                .split(':')[2]
                        ),
                        0
                    )
                    const torolve = ev.data.logs.findLastIndex(
                        (element) =>
                            element.startsWith('[' + ev.data.nap) &&
                            element.includes(
                                'Törlődött a következő hívás: ' + i
                            ) &&
                            element.endsWith('TAXI törölte)')
                    )
                    const elfogadva = ev.data.logs.findLastIndex(
                        (element) =>
                            element.startsWith('[' + ev.data.nap) &&
                            element.endsWith(
                                'TAXI elfogadta a következő hívást: ' + i
                            )
                    )
                    if (torolve !== -1 && elfogadva === -1) {
                        let elf = new Date().setHours(
                            Number(
                                ev.data.logs[torolve]
                                    .split(' ')[1]
                                    .slice(undefined, -1)
                                    .split(':')[0]
                            ),
                            Number(
                                ev.data.logs[torolve]
                                    .split(' ')[1]
                                    .slice(undefined, -1)
                                    .split(':')[1]
                            ),
                            Number(
                                ev.data.logs[torolve]
                                    .split(' ')[1]
                                    .slice(undefined, -1)
                                    .split(':')[2]
                            ),
                            0
                        )
                        if (most - elf <= 60000) {
                            fo.egyperces++
                            if (ev.data.dates.length > 1) {
                                fo['Összesen'].egyperces++
                            }
                        }
                    } else {
                        const lemondott = ev.data.logs.findLastIndex(
                            (element) =>
                                element.startsWith('[' + ev.data.nap) &&
                                element.includes(
                                    'Törlődött a következő hívás: ' +
                                        i +
                                        ' (lemondta a játékos)'
                                )
                        )
                        const lemondott2 = ev.data.logs.findLastIndex(
                            (element) =>
                                element.startsWith('[' + ev.data.nap) &&
                                element.endsWith(
                                    'TAXI elfogadta a következő hívást: ' + i
                                )
                        )
                        if (lemondott !== -1 && lemondott2 == -1) {
                            let most = new Date().setHours(
                                Number(
                                    ev.data.logs[lemondott]
                                        .split(' ')[1]
                                        .slice(undefined, -1)
                                        .split(':')[0]
                                ),
                                Number(
                                    ev.data.logs[lemondott]
                                        .split(' ')[1]
                                        .slice(undefined, -1)
                                        .split(':')[1]
                                ),
                                Number(
                                    ev.data.logs[lemondott]
                                        .split(' ')[1]
                                        .slice(undefined, -1)
                                        .split(':')[2]
                                ),
                                0
                            )
                            if (akezdet < most && most < avege) {
                                fo.lemondott++
                                if (ev.data.dates.length > 1) {
                                    fo['Összesen'].lemondott++
                                }
                            }
                        }
                    }
                }
            }
        }
        await new Promise((resolve) => setTimeout(resolve, 0))
    }
    postMessage({ nap: ev.data.nap, fo })
}
