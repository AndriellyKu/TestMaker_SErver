    const Turma = require('../models/Turma');
    const User = require('../models/User');


    exports.criarTurma = async (req, res) => {
        const { nome, turma, professorId, background } = req.body;

        try {
            const professor = await User.findById(professorId);
            if (!professor || professor.userType !== 'professor') {
                return res.status(400).json({ message: 'Professor inválido.' });
            }


            const novaTurma = new Turma({
                nome,
                turma,
                professor: professorId,
                background,
            });


            await novaTurma.save();
            res.status(201).json(novaTurma);
        } catch (error) {
            console.error('Erro ao criar turma:', error);
            res.status(500).json({ message: 'Erro ao criar turma.' });
        }
    };
