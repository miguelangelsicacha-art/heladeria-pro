const productos = [
    { nombre: "Helados", precio: 1100, id: "hel" },
    { nombre: "Chococonos", precio: 1400, id: "cho" },
    { nombre: "Cremas", precio: 2100, id: "cre" },
    { nombre: "Paletas", precio: 400, id: "pal" }
];

let inventario = JSON.parse(localStorage.getItem('inv_v2')) || { "Helados": 0, "Chococonos": 0, "Cremas": 0, "Paletas": 0 };
let empleados = JSON.parse(localStorage.getItem('emp_v2')) || ["General"];

function verTab(tabId, btn) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    btn.classList.add('active');
    render();
}

function render() {
    localStorage.setItem('inv_v2', JSON.stringify(inventario));
    localStorage.setItem('emp_v2', JSON.stringify(empleados));

    // Select Empleados
    const select = document.getElementById('select-empleado');
    select.innerHTML = empleados.map(e => `<option value="${e}">${e}</option>`).join('');

    // Tabla Liquidación
    const tabla = document.getElementById('tabla-liquidacion');
    tabla.innerHTML = productos.map(p => `
        <tr>
            <td style="padding:10px 0;">
                <strong>${p.nombre}</strong><br>
                <small style="color:var(--text-muted)">Stock: ${inventario[p.nombre]}</small>
            </td>
            <td><input type="number" id="s-${p.id}" placeholder="Salió" inputmode="numeric" style="width:70px"></td>
            <td><input type="number" id="d-${p.id}" placeholder="Dev" inputmode="numeric" style="width:70px"></td>
        </tr>
    `).join('');

    // Grid Stock
    document.getElementById('stock-display').innerHTML = productos.map(p => `
        <div class="stock-badge">
            <span style="font-size:0.8rem">${p.nombre}</span>
            <span>${inventario[p.nombre]}</span>
        </div>
    `).join('');

    // Inputs Producción
    document.getElementById('inputs-produccion').innerHTML = productos.map(p => `
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px;">
            <span>${p.nombre}</span>
            <input type="number" id="p-${p.id}" placeholder="0" style="width:100px" inputmode="numeric">
        </div>
    `).join('');

    // Lista Empleados
    document.getElementById('lista-empleados').innerHTML = empleados.map((e, i) => `
        <div class="emp-item">
            <span>${e}</span>
            <button onclick="borrarEmp(${i})" style="background:none; border:none; color:red; cursor:pointer;">Eliminar</button>
        </div>
    `).join('');
}

function sumarProduccion() {
    productos.forEach(p => {
        const val = parseInt(document.getElementById(`p-${p.id}`).value) || 0;
        inventario[p.nombre] += val;
    });
    alert("¡Inventario cargado!");
    render();
}

function liquidar() {
    let total = 0;
    let msg = `*LIQUIDACIÓN: ${document.getElementById('select-empleado').value}*%0A`;
    
    productos.forEach(p => {
        const s = parseInt(document.getElementById(`s-${p.id}`).value) || 0;
        const d = parseInt(document.getElementById(`d-${p.id}`).value) || 0;
        const v = s - d;

        if(v > 0) {
            const sub = v * p.precio;
            total += sub;
            inventario[p.nombre] -= v;
            msg += `• ${p.nombre}: ${v} x $${p.precio} = $${sub.toLocaleString()}%0A`;
        }
    });

    const otros = parseInt(document.getElementById('otros-cargos').value) || 0;
    const final = total + otros;
    if(otros !== 0) msg += `• Otros cargos: $${otros.toLocaleString()}%0A`;
    msg += `*TOTAL A PAGAR: $${final.toLocaleString()}*`;

    const resumen = document.getElementById('resumen-pago');
    resumen.style.display = "block";
    resumen.innerHTML = `
        <p style="margin-top:0">Total Calculado:</p>
        <h2 style="color:var(--success); margin:0">$${final.toLocaleString()}</h2>
        <button class="btn btn-success" style="margin-top:15px; background:#25D366" onclick="window.open('https://wa.me/?text=${msg}')">Enviar por WhatsApp</button>
    `;
    render();
}

function agregarEmpleado() {
    const n = document.getElementById('nuevo-empleado').value;
    if(n) { empleados.push(n); document.getElementById('nuevo-empleado').value=""; render(); }
}

function borrarEmp(i) { if(confirm("¿Eliminar empleado?")) { empleados.splice(i,1); render(); } }

function reiniciarTodo() { if(confirm("¿BORRAR TODO?")) { localStorage.clear(); location.reload(); } }

render();
