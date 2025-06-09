
const carrinho = [];
const numeroWhatsApp = '5561981227195'; // Número do restaurante

function adicionarCarrinho(item, preco) {
    carrinho.push({ item, preco });
    atualizarCarrinho();
    mostrarNotificacao(`✔️ ${item} adicionado ao carrinho!`);
}

function removerCarrinho(index) {
    const itemRemovido = carrinho[index].item;
    carrinho.splice(index, 1);
    atualizarCarrinho();
    mostrarNotificacao(`❌ ${itemRemovido} removido do carrinho`);
}

function atualizarCarrinho() {
    const lista = document.getElementById('lista-carrinho');
    const total = document.getElementById('total');
    lista.innerHTML = '';
    
    if (carrinho.length === 0) {
        lista.innerHTML = '<li class="empty-cart">Seu carrinho está vazio</li>';
        total.textContent = 'Total: R$0.00';
        return;
    }
    
    let soma = 0;
    carrinho.forEach(({ item, preco }, i) => {
        const li = document.createElement('li');
        li.className = 'carrinho-item';
        li.innerHTML = `
            <span>${item} - R$${preco.toFixed(2)}</span>
            <button class="remover-btn" onclick="removerCarrinho(${i})">Remover</button>
        `;
        lista.appendChild(li);
        soma += preco;
    });
    total.textContent = `Total: R$${soma.toFixed(2)}`;
}

function mostrarNotificacao(mensagem) {
    const notificacao = document.createElement('div');
    notificacao.style.position = 'fixed';
    notificacao.style.bottom = '20px';
    notificacao.style.right = '20px';
    notificacao.style.backgroundColor = '#2ECC71';
    notificacao.style.color = 'white';
    notificacao.style.padding = '12px 20px';
    notificacao.style.borderRadius = '6px';
    notificacao.style.zIndex = '1000';
    notificacao.style.boxShadow = '0 3px 6px rgba(0,0,0,0.16)';
    notificacao.textContent = mensagem;
    
    document.body.appendChild(notificacao);
    
    setTimeout(() => {
        notificacao.style.opacity = '0';
        notificacao.style.transition = 'opacity 0.5s';
        setTimeout(() => {
            document.body.removeChild(notificacao);
        }, 500);
    }, 3000);
}

function validarTelefone(telefone) {
    const numeroLimpo = telefone.replace(/\D/g, '');
    return numeroLimpo.length >= 10 && numeroLimpo.length <= 13;
}

function formatarTelefone(telefone) {
    const numeroLimpo = telefone.replace(/\D/g, '');
    if (numeroLimpo.length === 11) {
        return numeroLimpo.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
    }
    return telefone;
}

function enviarPedido() {
    const nome = document.getElementById('nome').value.trim();
    const telefone = document.getElementById('telefone').value.trim();
    const mesa = document.getElementById('mesa').value.trim();
    const observacoes = document.getElementById('observacoes').value.trim();

    // Validações
    if (!nome) {
        alert('Por favor, informe seu nome completo.');
        return;
    }
    
    if (!telefone || !validarTelefone(telefone)) {
        alert('Por favor, informe um número de WhatsApp válido com DDD.');
        return;
    }
    
    if (!mesa) {
        alert('Por favor, informe o número da mesa ou "Entrega".');
        return;
    }
    
    if (carrinho.length === 0) {
        alert('Seu carrinho está vazio. Adicione pelo menos um item.');
        return;
    }

    // Mostrar loading
    document.getElementById('loading').classList.remove('hidden');

    // Formatar mensagem
    let mensagem = `*🏮 PEDIDO - RESTAURANTE CHINÊS ORIENTAL 🏮*\n\n` +
        `👤 *Cliente:* ${nome}\n` +
        `📱 *WhatsApp:* ${formatarTelefone(telefone)}\n` +
        `📍 *Mesa/Entrega:* ${mesa}\n\n` +
        `🍽️ *Itens do Pedido:*\n`;

    carrinho.forEach(({ item, preco }) => {
        mensagem += `✔️ ${item} - R$${preco.toFixed(2)}\n`;
    });

    const total = carrinho.reduce((s, i) => s + i.preco, 0);
    mensagem += `\n💰 *Total:* R$${total.toFixed(2)}\n\n` +
                `⏱️ *Tempo estimado:* 30-40 minutos\n`;
    
    if (observacoes) {
        mensagem += `📝 *Observações:*\n${observacoes}\n\n`;
    }
    
    mensagem += `🙏 *Agradecemos pela preferência!*\n` +
               `🔔 Seu pedido será preparado em breve.`;

    // Codificar a mensagem para URL
    const mensagemCodificada = encodeURIComponent(mensagem);
    const url = `https://wa.me/${numeroWhatsApp}?text=${mensagemCodificada}`;

    // Abrir WhatsApp após pequeno delay para mostrar o loading
    setTimeout(() => {
        window.open(url, '_blank');
        document.getElementById('loading').classList.add('hidden');
        
        // Limpar carrinho após envio
        carrinho.length = 0;
        atualizarCarrinho();
        document.getElementById('nome').value = '';
        document.getElementById('telefone').value = '';
        document.getElementById('mesa').value = '';
        document.getElementById('observacoes').value = '';
        
        // Notificação de sucesso
        mostrarNotificacao('✅ Pedido enviado com sucesso!');
    }, 1500);
}

// Inicializar carrinho vazio
atualizarCarrinho();
