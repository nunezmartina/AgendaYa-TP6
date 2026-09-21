/**
 * AgendaYA — Tests unitarios del módulo M06 (Notificaciones)
 * Tarea C del TP6. 40 tests en total: cada uno de los 8 integrantes del
 * equipo desarrolló 5 tests, cubriendo al menos 2 funciones/comportamientos
 * distintos con casos normales, límite/borde y de error, según exige la
 * sección 7.1 de la consigna. Asistidos con IA (ver prompts documentados
 * en el informe, sección Tarea C).
 */

const {
  esEmailValido,
  generarAsunto,
  calcularEsPorDefecto,
  puedeQuitarPorDefecto,
  construirCuerpoEmail,
  puedeEliminarPlantilla,
  esElegibleParaRecordatorio,
  validarCamposPlantilla,
  enmascararEmail,
} = require('../src/logica-negocio');

// ============================================================================
// Responsable: Nuñez Martina
// Funciones: esEmailValido (3 tests) + generarAsunto (2 tests)
// ============================================================================
describe('Nuñez Martina — esEmailValido y generarAsunto', () => {
  test('[esEmailValido] caso normal: email con formato correcto retorna true', () => {
    expect(esEmailValido('usuario@dominio.com')).toBe(true);
  });

  test('[esEmailValido] caso de error: falta el dominio (usuario@) retorna false', () => {
    expect(esEmailValido('usuario@')).toBe(false);
  });

  test('[esEmailValido] caso borde: string vacío retorna false', () => {
    expect(esEmailValido('')).toBe(false);
  });

  test('[generarAsunto] caso normal: asunto de confirmación sigue el patrón exacto', () => {
    expect(generarAsunto('confirmacion', { nombreProfesional: 'Dr. García' }))
      .toBe('Tu reserva con Dr. García está confirmada');
  });

  test('[generarAsunto] caso normal: asunto de recordatorio sigue el patrón exacto', () => {
    expect(generarAsunto('recordatorio', { nombreProfesional: 'Dr. García' }))
      .toBe('Recordatorio: tu turno con Dr. García es mañana');
  });
});
// ============================================================================
// Responsable: Aguiar Josefina
// Funciones: calcularEsPorDefecto (3 tests) + puedeQuitarPorDefecto (2 tests)
// ============================================================================
describe('Aguiar Josefina — calcularEsPorDefecto y puedeQuitarPorDefecto', () => {
  test('[calcularEsPorDefecto] caso normal: primera plantilla del tipo queda por defecto aunque el tick esté apagado', () => {
    expect(calcularEsPorDefecto({ existeOtraPlantillaDelTipo: false, tickActivado: false })).toBe(true);
  });

  test('[calcularEsPorDefecto] caso normal: nueva plantilla con tick activado desplaza a la anterior', () => {
    expect(calcularEsPorDefecto({ existeOtraPlantillaDelTipo: true, tickActivado: true })).toBe(true);
  });

  test('[calcularEsPorDefecto] caso normal: nueva plantilla sin tick activado queda como alternativa', () => {
    expect(calcularEsPorDefecto({ existeOtraPlantillaDelTipo: true, tickActivado: false })).toBe(false);
  });

  test('[puedeQuitarPorDefecto] caso de error: no se puede quitar el tick si es la única plantilla del tipo', () => {
    expect(puedeQuitarPorDefecto({ esUnicaPlantillaDelTipo: true })).toBe(false);
  });

  test('[puedeQuitarPorDefecto] caso normal: se puede quitar el tick si existe otra plantilla del tipo', () => {
    expect(puedeQuitarPorDefecto({ esUnicaPlantillaDelTipo: false })).toBe(true);
  });
});

