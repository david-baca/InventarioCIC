module.exports = (req, res, next) => {
    const { codigo, descripcion ,motivo} = req.body;

    if (codigo && codigo.length > 45) {
        return res.status(400).json({
            error: 'El campo "codigo" no debe exceder 45 caracteres.'
        });
    }

    if (codigo && !/^\d+$/.test(codigo)) {
        return res.status(400).json({
            error: 'El campo "codigo" solo debe contener números.'
        });
    }

    if (descripcion && descripcion.length > 250) {
        return res.status(400).json({
            error: 'El campo "descripcion" no debe exceder 250 caracteres.'
        });
    }
    

    if (motivo && motivo.length > 250) {
        return res.status(400).json({ error: 'El motivo no puede exceder 250 caracteres.' });
    }
        
    next(); // Si todo está bien, continúa al siguiente middleware o controlador
};