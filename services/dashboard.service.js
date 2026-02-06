const boom = require("@hapi/boom");
const { Sequelize, Op } = require('sequelize');
const { models } = require('../libs/sequelize');

class DashboardService {
    constructor() { }

    async getDashboardStats(query) {
        // 1. Recibir y limpiar parámetros
        const { tiendaId, tipo } = query;

        // Manejo de Estados (Array para selección múltiple)
        let estados = query?.estados;
        if (estados && !Array.isArray(estados)) {
            estados = [estados];
        }

        // 2. Construir el filtro para la tabla ELEMENTO
        const whereElemento = {};
        if (tiendaId) {
            whereElemento.tiendaId = tiendaId;
        }
        if (estados && estados.length > 0) {
            whereElemento.estado = { [Op.in]: estados };
        }
        if (tipo) {
            whereElemento.tipo = tipo;
        }

        // 3. Configuración del JOIN anidado (Asignación -> Movimiento -> Elemento)
        // Esto es lo que permite que las actas y responsables se filtren por tienda/estado
        const includeParaActas = {
            model: models.Movimiento,
            as: 'elementos', // Alias definido en Asignaciones.associate
            required: true,
            include: [{
                model: models.Elemento,
                as: 'elemento', // Asegúrate que este alias esté en Movimiento.associate
                where: whereElemento,
                required: true
            }]
        };

        try {
            const [totalActas, totalActivos, disponibles, responsables, porTipo, porEstado] = await Promise.all([

                // 1. Total Actas: Filtradas por los elementos que contienen
                models.Asignaciones.count({
                    distinct: true,
                    col: 'id',
                    include: [includeParaActas]
                }),

                // 2. Total Activos: Directo sobre Elementos
                models.Elemento.count({ where: whereElemento }),

                // 3. Disponibles: Filtro base + estado 'Disponible'
                models.Elemento.count({
                    where: { ...whereElemento, estado: 'Disponible' }
                }),

                // 4. Responsables: Personas únicas ligadas a esos elementos filtrados
                models.Asignaciones.count({
                    distinct: true,
                    col: 'contacto_id', // Nombre exacto en tu AsignacionesSchema
                    include: [includeParaActas]
                }),

                // 5. Gráficas (Basadas en la tabla Elementos)
                models.Elemento.findAll({
                    attributes: ['tipo', [Sequelize.fn('COUNT', Sequelize.col('*')), 'cantidad']],
                    where: whereElemento,
                    group: ['tipo'],
                    raw: true
                }),
                models.Elemento.findAll({
                    attributes: ['estado', [Sequelize.fn('COUNT', Sequelize.col('*')), 'cantidad']],
                    where: whereElemento,
                    group: ['estado'],
                    raw: true
                })
            ]);

            return {
                kpis: {
                    totalActas,
                    totalActivos,
                    disponibles,
                    responsables
                },
                porTipo: porTipo.map(t => ({
                    tipo: t.tipo || 'Otros',
                    cantidad: parseInt(t.cantidad || 0)
                })),
                porEstado: porEstado.map(e => ({
                    estado: e.estado || 'Otros',
                    cantidad: parseInt(e.cantidad || 0)
                })),
                actasMensuales: [5, 10, 15, 7, 20, 25]
            };
        } catch (error) {
            console.error("Error Dashboard:", error);
            throw boom.badImplementation(error);
        }
    }
}

module.exports = DashboardService;