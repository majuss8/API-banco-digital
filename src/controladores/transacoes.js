const { format } = require('date-fns');
const bancoDeDados = require('../bancodedados');

const depositar = (req, res) => { 
    const { numero_conta, valor } = req.body; 

    const conta = bancoDeDados.contas.find((conta) => { 
        return conta.numero === numero_conta;
    });

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' })
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'Informe um valor válido!' })
    }

    conta.saldo += valor 

    const data = new Date() 

    const deposito = { 
        data: format(data, 'yyyy-MM-dd HH:mm:ss'), 
        numero_conta,
        valor
    }

    bancoDeDados.depositos.push(deposito); 

    return res.status(200).json({ mensagem: 'Depósito realizado com sucesso.' });
};

const sacar = (req, res) => { 
    const { numero_conta, valor, senha } = req.body; 

    const conta = bancoDeDados.contas.find((conta) => {
        return conta.numero === numero_conta;
    });

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' })
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'Informe um valor válido!' })
    }

    if (senha !== conta.usuario.senha) {
        return res.status(400).json({ mensagem: 'Senha incorreta.' }) 
    }

    conta.saldo -= valor; // 

    const data = new Date()

    const saque = { 
        data: format(data, 'yyyy-MM-dd HH:mm:ss'),
        numero_conta,
        valor
    };

    bancoDeDados.saques.push(saque); 

    return res.status(200).json({ mensagem: 'Saque realizado com sucesso.' });
};

const tranferir = (req, res) => { 
    const { numero_conta_origem, numero_conta_destino, valor, senha } = req.body; 

    const contaOrigem = bancoDeDados.contas.find((conta) => { 
        return conta.numero === numero_conta_origem;
    });

    const contaDestino = bancoDeDados.contas.find((conta) => {  
        return conta.numero === numero_conta_destino;
    });

    if (!contaOrigem || !contaDestino) { 
        return res.status(404).json({ mensagem: 'Conta não encontrada.' });
    }

    if (valor <= 0) {
        return res.status(400).json({ mensagem: 'Informe um valor válido!' });
    }

    if (valor > contaOrigem.saldo) {
        return res.status(403).json({ mensagem: 'Saldo insuficiente.' });
    }

    if (senha !== contaOrigem.usuario.senha) {
        return res.status(400).json({ mensagem: 'Senha incorreta.' }) 
    }

    contaOrigem.saldo -= valor; 
    contaDestino.saldo += valor; 

    const data = new Date()

    const novaTransferencia = {  
        data: format(data, 'yyyy-MM-dd HH:mm:ss'),
        numero_conta_origem,
        numero_conta_destino,
        valor
    };

    bancoDeDados.transferencias.push(novaTransferencia); 

    return res.status(200).json({ mensagem: 'Transferência realizado com sucesso.' });
};

module.exports = { 
    depositar,
    sacar,
    tranferir
};