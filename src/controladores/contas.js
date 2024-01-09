const bancoDeDados = require('../bancodedados'); 

const listarContas = (req, res) => { 
    const { senha_banco } = req.query; 

    if (!senha_banco) { 
        return res.status(400).json({ mensagem: 'senha obrigatória!' });
    }

    if (senha_banco !== bancoDeDados.banco.senha) { 
        return res.status(403).json({ mensagem: 'senha inválida! '});
    }

    return res.status(200).json(bancoDeDados.contas); 

};

const criarConta = (req, res) => { 
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body; 

    if (!nome) { 
        return res.status(400).json({ mensagem: 'Campo nome é obrigatótio!' });
    }
    if (!cpf) {
        return res.status(400).json({ mensagem: 'Campo CPF é obrigatótio!' });
    }
    if (!data_nascimento) {
        return res.status(400).json({ mensagem: 'Campo data_nascimento é obrigatótio!' });
    }
    if (!telefone) {
        return res.status(400).json({ mensagem: 'Campo telefone é obrigatótio!' });
    }
    if (!email) {
        return res.status(400).json({ mensagem: 'Campo email é obrigatótio!' });
    }
    if (!senha) {
        return res.status(400).json({ mensagem: 'Campo senha é obrigatótio!' });
    }

    const conta = { 
        numero: bancoDeDados.identificadorUnico++,
        saldo: 0,
        usuario: {
            nome,
            cpf,
            data_nascimento,
            telefone,
            email,
            senha
        }
    }

    bancoDeDados.contas.push(conta); 

    return res.status(201).json(conta); 
};

const atualizarUsuario = (req, res) => { 
    const { numeroConta } = req.params; 
    const { nome, cpf, data_nascimento, telefone, email, senha } = req.body; 

    const conta = bancoDeDados.contas.find((conta) => { 
        return conta.numero === Number(numeroConta); 
    });

    if (!conta) { 
        return res.status(404).json({ mensagem: 'Conta não encontrada.' })
    }

    if (nome) { 
        conta.usuario.nome = nome;
    } 

    if (cpf) {
        conta.usuario.cpf = cpf;
    } 

    if (data_nascimento) {
        conta.usuario.data_nascimento = data_nascimento;
    } 

    if (telefone) {
        conta.usuario.telefone = telefone;
    } 

    if (email) {
        conta.usuario.email = email;
    } 

    if (senha) {
        conta.usuario.senha = senha;
    } 

    return res.status(200).json({ mensagem: 'Conta atualizada com sucesso' });
};

const excluirConta = (req, res) => { 
    const { numeroConta } = req.params;
    
    const conta = bancoDeDados.contas.find((conta) => {
        return conta.numero === Number(numeroConta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' })
    }

    const indexConta = bancoDeDados.contas.indexOf(conta); 
    bancoDeDados.contas.splice(indexConta, 1); 

    return res.status(200).json({ mensagem: 'Conta excluída com sucesso' });
};

const consultarSaldo = (req, res) => { 
    const { numero_conta, senha } = req.query; 

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'Número da conta é obrigatório!' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'Senha é obrigatória!' });
    }

    const conta = bancoDeDados.contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' })
    }

    if (senha !== conta.usuario.senha) {
        return res.status(403).json({ mensagem: 'senha inválida! '});
    }

    const saldoConta = { 
        saldo: conta.saldo
    };
    
    return res.status(200).json(saldoConta); 
};

const extrato = (req, res) => { 
    const { numero_conta, senha } = req.query; 

    if (!numero_conta) {
        return res.status(400).json({ mensagem: 'Número da conta é obrigatório!' });
    }

    if (!senha) {
        return res.status(400).json({ mensagem: 'Senha é obrigatória!' });
    }

    const conta = bancoDeDados.contas.find((conta) => {
        return conta.numero === Number(numero_conta);
    });

    if (!conta) {
        return res.status(404).json({ mensagem: 'Conta não encontrada.' })
    }

    if (senha !== conta.usuario.senha) {
        return res.status(403).json({ mensagem: 'senha inválida! '});
    }
    
    const transferenciasEnviadas = bancoDeDados.transferencias.filter((transferencia) => {
        return transferencia.numero_conta_origem === numero_conta; 
    }); 

    const transferenciasRecebidas = bancoDeDados.transferencias.filter((transferencia) => {
        return transferencia.numero_conta_destino === numero_conta;  
    }); 

    const extrato = { 
        depositos: bancoDeDados.depositos,
        saques: bancoDeDados.saques,
        transferenciasEnviadas,
        transferenciasRecebidas
    };

    return res.status(200).json(extrato); 
};

module.exports = { 
    listarContas,
    criarConta,
    atualizarUsuario,
    excluirConta,
    consultarSaldo,
    extrato
};