const canvas = document.getElementById("manometro");
const ctx = canvas.getContext("2d");

function drawManometro(h_man) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Tubo en U
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#000";
    ctx.beginPath();
    ctx.moveTo(150, 50);
    ctx.lineTo(150, 350);

    ctx.moveTo(250, 50);
    ctx.lineTo(250, 350);

    ctx.moveTo(150, 350);
    ctx.lineTo(250, 350);

    ctx.stroke();

    // Escala simple
    const nivelBase = 300;
    const escala = 200; // pixels por metro (ajustable)

    const dy = h_man * escala;

    ctx.fillStyle = "blue";
    ctx.fillRect(150, nivelBase - dy, 30, dy);

    ctx.fillStyle = "blue";
    ctx.fillRect(250 - 30, nivelBase, 30, dy);

    ctx.fillStyle = "black";
    ctx.fillText(`Δh = ${h_man.toFixed(4)} m`, 140, 30);
}

document.getElementById("btnCompute").onclick = async () => {
    const payload = {
        h: parseFloat(h.value),
        rho: parseFloat(rho.value),
        g: parseFloat(g.value),
        rho_m: parseFloat(rho_m.value)
    };

    const res = await fetch("/compute", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(payload)
    });

    const data = await res.json();
    drawManometro(data.h_man);

    window.lastPressure = data.P;
};

document.getElementById("btnRecord").onclick = async () => {
    const hVal = parseFloat(h.value);

    if (!window.lastPressure) return;

    const res = await fetch("/record", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({h: hVal, P: window.lastPressure})
    });

    const data = await res.json();

    const tbody = document.querySelector("#tablaLecturas tbody");
    tbody.innerHTML = "";

    data.lecturas.forEach(([h, P]) => {
        tbody.innerHTML += `<tr><td>${h}</td><td>${P.toFixed(2)}</td></tr>`;
    });
};

document.getElementById("btnClear").onclick = async () => {
    await fetch("/clear", {method: "POST"});
    document.querySelector("#tablaLecturas tbody").innerHTML = "";
    ctx.clearRect(0,0,canvas.width,canvas.height);
};
