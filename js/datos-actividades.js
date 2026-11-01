/* =================================================================
   OFICINA · Bancos de las actividades conceptuales
   Cada actividad saca sus elementos de estos bancos, así que cada
   ronda es distinta. Las citas de los Estándares son textuales
   (Estándares Básicos de Competencias en Ciencias Sociales, MEN 2004).
================================================================= */

const ACTIVIDADES_META = [
  {id:1, title:"Simulador de decisiones", sub:"Árboles de decisión sobre convivencia escolar · Ley 1620 y Decreto 1965"},
  {id:2, title:"Laboratorio de fuentes", sub:"Lectura crítica: subraya datos, sesgos y premisas en fragmentos históricos"},
  {id:3, title:"Organizador normativo", sub:"Clasifica situaciones escolares en su marco legal correcto"},
  {id:4, title:"Taller de gestión académica", sub:"Razonamiento cuantitativo con datos nuevos en cada ronda"},
  {id:5, title:"Tarjetas de memoria", sub:"Modelos pedagógicos y su relación con los referentes del MEN"},
  {id:6, title:"Matriz de triangulación pedagógica", sub:"Situación de aula + Estándar + competencia comportamental"},
  {id:7, title:"Reconstrucción normativa", sub:"Completa textos que integran la normativa del concurso"}
];

/* ---------- 1. Simulador de decisiones (árboles) ---------- */
const BANCO_ARBOLES = [
{id:"arb-discriminacion",
 titulo:"Discriminación reiterada en un debate",
 situacion:"Durante un debate en grado 8° sobre migración, un estudiante hace comentarios discriminatorios contra un compañero de origen venezolano. Ya había ocurrido algo similar la semana anterior con el mismo estudiante afectado.",
 niveles:[
  {prompt:"¿Cuál es tu primera intervención, en el momento mismo del incidente?",
   opciones:[
    {t:"Llamar aparte al estudiante que hizo el comentario, decirle en privado que eso no se debe hacer, y continuar la clase con normalidad sin decir nada más al resto del curso sobre lo sucedido.",
     consecuencia:"El estudiante que hizo el comentario recibe el mensaje, pero el grupo no recibe ninguna señal de que la conducta fue inadecuada, y el estudiante afectado no recibe ningún respaldo visible.", correcto:false},
    {t:"Detener la clase un momento, nombrar con claridad ante el grupo que se trata de una conducta discriminatoria, ofrecer un espacio breve de contención al estudiante afectado, y anunciar que se activará el protocolo institucional correspondiente.",
     consecuencia:"El grupo entiende que la conducta no es aceptable, sin exponer ni humillar a nadie, y el estudiante afectado se siente respaldado.", correcto:true},
    {t:"Suspender de inmediato la actividad y remitir al estudiante directamente a coordinación para que sea sancionado, sin abrir ningún espacio de diálogo ni con él ni con el estudiante afectado en ese momento.",
     consecuencia:"La remisión inmediata sin ningún diálogo previo es desproporcionada y no atiende la situación del estudiante afectado ni contiene el clima del grupo en el momento del incidente.", correcto:false}
   ]},
  {prompt:"Dado que ya ocurrió algo similar la semana anterior con el mismo estudiante, ¿cómo procedes institucionalmente?",
   opciones:[
    {t:"Resolverlo tú mismo dentro del salón, sin informar al Comité Escolar de Convivencia ni a los acudientes, porque consideras que ya diste la instrucción correcta y el tema no debería escalar más allá del aula.",
     consecuencia:"No informar incumple el deber de identificar y reportar (Ley 1620, art. 19) y deja sin registro institucional una situación recurrente que puede volver a ocurrir.", correcto:false},
    {t:"Registrar el episodio en el observador del estudiante como una situación aislada y de baja gravedad, sin activar ningún protocolo adicional, ya que no hubo agresión física entre los dos estudiantes involucrados.",
     consecuencia:"Subclasificar una situación repetida como un hecho aislado contradice el criterio de repetición que el Decreto 1965 usa para diferenciar Tipo I de Tipo II.", correcto:false},
    {t:"Reportar el caso al Comité Escolar de Convivencia clasificándolo como situación Tipo II, dado su carácter repetido, y activar el protocolo correspondiente: informar a los acudientes y remitir al estudiante afectado a orientación.",
     consecuencia:"La clasificación es correcta: al repetirse, deja de ser un conflicto aislado y exige la intervención del Comité. El protocolo se activa a tiempo.", correcto:true}
   ]},
  {prompt:"Con el caso ya activado en el Comité, ¿cuál es el seguimiento más adecuado en las semanas siguientes?",
   opciones:[
    {t:"Documentar el caso ante el Comité, coordinar con el orientador el acompañamiento psicosocial del estudiante afectado, y trabajar con todo el grupo estrategias de convivencia intercultural durante las semanas siguientes, con seguimiento posterior.",
     consecuencia:"El caso queda documentado, el estudiante afectado recibe acompañamiento y el grupo trabaja el tema de fondo en lugar de solo sancionar. El seguimiento cierra el ciclo de la Ruta de Atención Integral.", correcto:true},
    {t:"Entregar todo el expediente al orientador y considerar que tu responsabilidad como docente de aula terminó ahí, sin volver a mencionar el tema en tus clases ni preguntar cómo sigue el estudiante afectado.",
     consecuencia:"Delegar por completo desatiende tu propia función de acompañar el proceso y de trabajar el tema con el grupo, que es donde ocurrió el incidente.", correcto:false},
    {t:"Ubicar al estudiante afectado en un puesto alejado del grupo durante varias semanas, como medida de protección temporal, sin trabajar directamente con el resto del curso la conducta que generó el problema.",
     consecuencia:"Aislar a la víctima, en lugar de trabajar la conducta del grupo, la revictimiza y no resuelve la causa del problema.", correcto:false}
   ]}
 ],
 cierre:"Es Tipo II porque, según el Decreto 1965 de 2013 (art. 40), la agresión se presenta de manera repetida; como docente te corresponde identificarla y reportarla (Ley 1620, art. 19). Evidenciaste dos competencias comportamentales de la Resolución 3842: <b>negociación y mediación</b> (contener el incidente sin escalarlo ni evadirlo) y <b>compromiso social e institucional</b> (sostener la Ruta de Atención Integral más allá de la sanción)."
},
{id:"arb-ciberacoso",
 titulo:"Memes en el grupo del curso",
 situacion:"Una estudiante de grado 9° te muestra capturas de pantalla: desde hace tres semanas, en el grupo de WhatsApp del curso circulan memes que se burlan de su aspecto físico. Ha empezado a faltar a clase. Los mensajes se envían por la noche, fuera de la jornada escolar.",
 niveles:[
  {prompt:"La estudiante acaba de contártelo. ¿Qué haces primero?",
   opciones:[
    {t:"Entrar esa misma noche al grupo de WhatsApp del curso y exigir públicamente que borren los memes, advirtiendo a todos los participantes que habrá sanciones fuertes para quienes los compartieron.",
     consecuencia:"La intervención pública expone a la estudiante ante todo el curso, puede generar represalias y no deja ningún registro institucional del caso.", correcto:false},
    {t:"Explicarle con tacto que lo que ocurre por fuera de la jornada y en redes personales no es competencia del colegio, y sugerirle que sus padres lo resuelvan directamente con las familias de los otros estudiantes.",
     consecuencia:"Es falso: el ciberacoso entre estudiantes está dentro del Sistema Nacional de Convivencia Escolar. Negarse a actuar incumple el deber del docente de identificar y reportar.", correcto:false},
    {t:"Escucharla sin juzgar, guardar las capturas como evidencia, asegurarle que su identidad será protegida, e informar ese mismo día al rector o al coordinador para activar la ruta institucional.",
     consecuencia:"La estudiante se siente escuchada y protegida, hay evidencia y el caso entra a la ruta institucional sin exponerla.", correcto:true}
   ]},
  {prompt:"¿Cómo se clasifica la situación?",
   opciones:[
    {t:"Tipo II: es ciberacoso que no constituye delito y que se ha presentado de manera repetida y sistemática durante varias semanas contra la misma estudiante.",
     consecuencia:"Correcto: el Decreto 1965 (art. 40) incluye en el Tipo II el ciberacoso que no es delito y que se presenta de forma repetida o sistemática.", correcto:true},
    {t:"Tipo I: se trata de burlas entre compañeros de curso, sin daño al cuerpo, que pueden resolverse con una conversación mediada entre las partes en el aula.",
     consecuencia:"El Tipo I cubre conflictos esporádicos. Tres semanas de burlas dirigidas a la misma persona ya no son esporádicas.", correcto:false},
    {t:"Tipo III: toda agresión cometida a través de internet o de redes sociales se considera delito y debe remitirse de inmediato a la Policía Nacional.",
     consecuencia:"El medio no define el tipo. Es Tipo III solo si la conducta constituye un presunto delito; burlas sobre el aspecto físico, por sí solas, no lo son.", correcto:false}
   ]},
  {prompt:"El Comité ya conoce el caso. ¿Qué incluye el protocolo?",
   opciones:[
    {t:"Identificar de inmediato a los autores de los memes y expulsarlos del colegio, sin escuchar su versión, para dar un mensaje claro al resto de la comunidad educativa.",
     consecuencia:"Omite el debido proceso, las acciones restaurativas y la información a las familias que exige el protocolo Tipo II.", correcto:false},
    {t:"Informar a los padres de todos los involucrados, escuchar a las partes, acordar acciones restaurativas, dejar acta y reportar el caso al sistema de información, con seguimiento del Comité.",
     consecuencia:"Coincide con el protocolo Tipo II del Decreto 1965 (art. 43): información a las familias, espacios de escucha, acciones restaurativas, acta, reporte y seguimiento.", correcto:true},
    {t:"Pedir a la estudiante que se salga del grupo de WhatsApp y bloquee a sus compañeros, y dar el caso por cerrado una vez ella confirme que dejó de recibir los mensajes.",
     consecuencia:"Traslada la carga a la víctima y cierra el caso sin trabajar la conducta de quienes acosan.", correcto:false}
   ]}
 ],
 cierre:"El ciberacoso repetido que no constituye delito es Tipo II (Decreto 1965, art. 40), aunque ocurra fuera de la jornada. Su protocolo (art. 43) incluye informar a las familias, escuchar a las partes, acciones restaurativas, acta y reporte. Evidenciaste <b>comunicación y relaciones interpersonales</b> (escucha y manejo confidencial) y <b>compromiso social e institucional</b> (activar la ruta en lugar de evadirla)."
},
{id:"arb-lesion",
 titulo:"Agresión con lesión en el descanso",
 situacion:"En el descanso, un estudiante de grado 10° golpea a otro con un objeto. El agredido sangra por una herida en la cabeza; más tarde, en urgencias, le dan incapacidad médica de varios días.",
 niveles:[
  {prompt:"Estás de turno en el patio. ¿Qué haces primero?",
   opciones:[
    {t:"Garantizar la atención en salud del estudiante herido, llamando a emergencias o remitiéndolo de inmediato, separar a los involucrados e informar enseguida a los directivos.",
     consecuencia:"Primero la salud y la protección de los estudiantes; luego la ruta. Es el orden que fija el protocolo.", correcto:true},
    {t:"Llevar a los dos estudiantes a coordinación para que firmen un acta de compromiso, y después, una vez firmada, gestionar la atención médica del estudiante que resultó herido.",
     consecuencia:"Retrasar la atención en salud para cumplir un trámite pone en riesgo al estudiante herido y contradice el primer paso del protocolo.", correcto:false},
    {t:"Reunir de inmediato a los dos estudiantes en el patio para una mediación pedagógica, de modo que se disculpen mutuamente y el conflicto se resuelva antes de volver a clase.",
     consecuencia:"La mediación inmediata es el protocolo de un conflicto Tipo I. Aquí hay una lesión grave que exige atención en salud y otro protocolo.", correcto:false}
   ]},
  {prompt:"El estudiante tiene incapacidad médica. ¿Cómo se clasifica y quién informa a las autoridades?",
   opciones:[
    {t:"Tipo II, porque hubo daño al cuerpo; el Comité Escolar de Convivencia lo maneja internamente y no es necesario informar a ninguna autoridad externa.",
     consecuencia:"El Tipo II cubre daños sin incapacidad. Una lesión con incapacidad puede constituir delito y pasa al Tipo III.", correcto:false},
    {t:"Tipo III, porque la agresión puede constituir un presunto delito; el presidente del Comité Escolar de Convivencia debe informar de inmediato a la Policía Nacional y a las familias.",
     consecuencia:"Correcto: Decreto 1965 (art. 40 y art. 44, num. 3). El presidente del Comité informa a la Policía de manera inmediata y por el medio más expedito.", correcto:true},
    {t:"Tipo III, pero conviene esperar a la siguiente reunión ordinaria del Comité para que sus miembros decidan, con calma, si vale la pena informar o no a la Policía.",
     consecuencia:"El protocolo Tipo III exige informar a la Policía de inmediato; esperar la reunión ordinaria lo incumple.", correcto:false}
   ]},
  {prompt:"La Policía ya conoce el caso. ¿Qué hace la institución?",
   opciones:[
    {t:"Suspender cualquier actuación institucional sobre el caso hasta que la Policía o la Fiscalía terminen su investigación, para no interferir con el proceso penal.",
     consecuencia:"Falso: el Decreto 1965 (art. 44) obliga a la institución a adoptar sus propias medidas, sin perjuicio de lo que hagan las autoridades.", correcto:false},
    {t:"Contar el caso, con nombres y detalles, en la siguiente reunión general de padres de familia, para que toda la comunidad sepa lo ocurrido y se prevengan nuevos hechos.",
     consecuencia:"Expone a los estudiantes y viola la confidencialidad que exige el protocolo.", correcto:false},
    {t:"Convocar al Comité, informar a sus miembros guardando la confidencialidad, adoptar medidas propias de protección, reportar el caso al sistema de información y hacer seguimiento.",
     consecuencia:"Coincide con el protocolo Tipo III (art. 44): el colegio actúa en paralelo a las autoridades, con confidencialidad y seguimiento.", correcto:true}
   ]}
 ],
 cierre:"Una agresión que puede constituir delito es Tipo III (Decreto 1965, art. 40). Tú identificas y reportas (Ley 1620, art. 19); el presidente del Comité informa a la Policía Nacional (art. 44). La institución no se detiene: adopta sus propias medidas. Evidenciaste <b>compromiso social e institucional</b> y criterio para priorizar la protección del estudiante."
}
];

/* ---------- 2. Laboratorio de fuentes ---------- */
const BANCO_FRAGMENTOS = [
{id:"frag-tierra",
 titulo:"Tierra y conflicto armado",
 segmentos:[
  {text:"El conflicto armado colombiano no puede explicarse únicamente por la presencia de actores armados, sino por una disputa histórica sobre la tenencia de la tierra. "},
  {text:"En 1936, una reforma constitucional incorporó la función social de la propiedad y la Ley 200 de ese mismo año reguló el régimen de tierras", tag:"dato"},
  {text:". Aun así, en regiones como el Magdalena Medio la concentración de la tierra siguió alimentando conflictos agrarios. Por esta razón, "},
  {text:"puede afirmarse que el origen del conflicto armado en todo el país responde principalmente a la dinámica de tenencia de la tierra observada en esa región", tag:"sesgo"},
  {text:". "},
  {text:"Es evidente, además, que ninguna política de desarrollo rural puede considerarse legítima si no resuelve primero esta desigualdad estructural", tag:"premisa"},
  {text:". Sin embargo, otras zonas del país, como la Orinoquía y el Pacífico, vivieron conflictos ligados a lógicas económicas distintas, como los hidrocarburos y la minería, que esta explicación no logra cubrir."}
 ],
 tareas:[
  {tag:"premisa", label:"Subraya la premisa normativa: un juicio de valor que el texto da por evidente y que no se puede verificar con datos.",
   exp:"«Ninguna política... puede considerarse legítima» es un juicio de valor presentado como evidente («es evidente»), sin cifra ni fuente que lo sostenga."},
  {tag:"sesgo", label:"Subraya el sesgo geográfico: una generalización indebida de una región a todo el país.",
   exp:"La frase extiende lo observado en el Magdalena Medio al «origen del conflicto armado en todo el país». El propio texto muestra después regiones que no encajan."},
  {tag:"dato", label:"Subraya el dato verificable que el texto usa como evidencia.",
   exp:"La reforma de 1936 y la Ley 200 son hechos comprobables en fuentes jurídicas: es el dato que sostiene el argumento."}
 ],
 cierre:"Distinguir dato, generalización y juicio de valor es lo que pide el estándar de 10° a 11°: «Analizo críticamente los documentos (qué tipo de documento es, quién es el autor, a quién está dirigido, de qué habla, por qué se produjo, desde qué posición ideológica está hablando, qué significa para mí…)»."
},
{id:"frag-colonizacion",
 titulo:"La colonización antioqueña",
 segmentos:[
  {text:"Durante el siglo XIX, la llamada colonización antioqueña transformó el centro-occidente colombiano. "},
  {text:"En 1849 se fundó Manizales, y décadas después el café se convirtió en el eje económico de la región", tag:"dato"},
  {text:". Un manual escolar de mediados del siglo XX explicaba así el proceso: "},
  {text:"«el avance se debió al carácter emprendedor y laborioso que distingue a la raza antioqueña»", tag:"esencialismo"},
  {text:". Sin embargo, la expansión estuvo marcada por pleitos entre colonos pobres y grandes concesionarios que reclamaban la propiedad de los baldíos, como ocurrió con la concesión Aranzazu. Pese a ello, "},
  {text:"puede concluirse que la colonización fue un reparto pacífico y equitativo de la tierra entre todos los que llegaron", tag:"conclusion"},
  {text:"."}
 ],
 tareas:[
  {tag:"esencialismo", label:"Subraya la explicación esencialista: atribuye un proceso histórico a un rasgo supuestamente natural de un grupo.",
   exp:"Explica la colonización por un «carácter» propio de una «raza», no por condiciones económicas, políticas o demográficas. Es una explicación esencialista, frecuente en manuales antiguos."},
  {tag:"dato", label:"Subraya el dato verificable.",
   exp:"La fundación de Manizales en 1849 y el posterior auge cafetero son hechos comprobables."},
  {tag:"conclusion", label:"Subraya la conclusión que contradice la evidencia del propio texto.",
   exp:"El texto acaba de mencionar pleitos entre colonos pobres y concesionarios; concluir que fue un reparto «pacífico y equitativo» no se sigue de esa evidencia."}
 ],
 cierre:"El estándar de 8° a 9° pide comparar «las causas de algunas olas de migración y desplazamiento humano en nuestro territorio a lo largo del siglo XIX y la primera mitad del siglo XX (colonización antioqueña, urbanización del país...)» y analizar críticamente los documentos e identificar sus tesis."
},
{id:"frag-frente",
 titulo:"El Frente Nacional",
 segmentos:[
  {text:"Tras la década de La Violencia, "},
  {text:"liberales y conservadores pactaron el Frente Nacional, aprobado en el plebiscito de 1957: entre 1958 y 1974 alternaron la presidencia y se repartieron por mitades los cargos públicos", tag:"dato"},
  {text:". Para algunos analistas, "},
  {text:"la exclusión de otras fuerzas políticas fue la única causa del surgimiento de las guerrillas en los años sesenta", tag:"monocausal"},
  {text:". Otros factores, como la desigualdad en el campo y el contexto de la Guerra Fría, también suelen señalarse. En cualquier caso, "},
  {text:"un acuerdo que deja por fuera a una parte de la ciudadanía nunca puede considerarse un verdadero logro democrático", tag:"premisa"},
  {text:"."}
 ],
 tareas:[
  {tag:"monocausal", label:"Subraya la explicación monocausal: reduce un fenómeno complejo a una sola causa.",
   exp:"Afirma que la exclusión fue «la única causa». El mismo texto menciona enseguida otros factores (desigualdad rural, Guerra Fría)."},
  {tag:"premisa", label:"Subraya la premisa normativa.",
   exp:"«Nunca puede considerarse un verdadero logro democrático» es una valoración, no un hecho verificable. Puede debatirse, pero no se prueba con datos."},
  {tag:"dato", label:"Subraya el dato verificable.",
   exp:"El plebiscito de 1957, el periodo 1958-1974, la alternación presidencial y la paridad en los cargos son hechos comprobables."}
 ],
 cierre:"El estándar de 10° a 11° pide identificar «las causas, características y consecuencias del Frente Nacional» y explicar «el surgimiento de la guerrilla, el paramilitarismo y el narcotráfico en Colombia». Separar hechos, causas y valoraciones es la base para hacerlo."
}
];

/* ---------- 3. Organizador normativo ---------- */
const CATS_NORM = [
  {key:"disciplinario", label:"Deber del docente (régimen disciplinario)"},
  {key:"ruta", label:"Ruta de Atención Integral (Ley 1620)"},
  {key:"autonomia", label:"Autonomía curricular (Ley 115)"}
];
const EXP_NORM = {
  disciplinario:"Es un incumplimiento de los deberes del docente como servidor público (Decreto 1278 de 2002). Se tramita por la vía disciplinaria (Código General Disciplinario, Ley 1952 de 2019), no por la ruta de convivencia.",
  ruta:"Es una situación que afecta la convivencia escolar y se atiende con los protocolos de la Ruta de Atención Integral (Ley 1620 y Decreto 1965 de 2013).",
  autonomia:"La Ley 115 de 1994 (art. 77) da a las instituciones autonomía para organizar las áreas fundamentales, introducir asignaturas optativas, adaptar áreas a las necesidades regionales, adoptar métodos de enseñanza y organizar actividades formativas."
};
const BANCO_NORM = [
  {id:"n-d1", cat:"disciplinario", text:"Un docente llega reiteradamente tarde a sus clases sin justificación y no entrega los informes académicos en los plazos fijados por la institución."},
  {id:"n-d2", cat:"disciplinario", text:"Un docente divulga sin autorización información confidencial sobre la situación familiar de un estudiante."},
  {id:"n-d3", cat:"disciplinario", text:"Un docente se ausenta de la jornada durante dos días sin permiso ni reporte a la institución."},
  {id:"n-d4", cat:"disciplinario", text:"Un docente modifica en la plataforma la nota de un estudiante a cambio de un pago de la familia."},
  {id:"n-d5", cat:"disciplinario", text:"Un docente se presenta a dictar clase bajo los efectos del alcohol."},
  {id:"n-d6", cat:"disciplinario", text:"Un docente oficial usa su clase para hacer campaña a favor de un candidato a la alcaldía."},
  {id:"n-r1", cat:"ruta", text:"Se detecta un caso de acoso escolar recurrente entre dos estudiantes de grado 7°."},
  {id:"n-r2", cat:"ruta", text:"Un estudiante reporta al Comité Escolar de Convivencia una situación de ciberacoso sufrida fuera del horario escolar."},
  {id:"n-r3", cat:"ruta", text:"Dos estudiantes se empujan una sola vez en el descanso por un balón, sin lesiones.",
   exp:"Aunque parezca menor, también es Ruta de Atención Integral: el Decreto 1965 lo clasifica como situación Tipo I y le fija un protocolo de mediación pedagógica."},
  {id:"n-r4", cat:"ruta", text:"Un estudiante resulta con incapacidad médica tras ser golpeado por un compañero en la salida del colegio."},
  {id:"n-r5", cat:"ruta", text:"Durante semanas, varios estudiantes imitan y ridiculizan el acento de un compañero que llegó de la costa."},
  {id:"n-r6", cat:"ruta", text:"Circula entre estudiantes una imagen íntima de una compañera de 15 años, compartida sin su consentimiento."},
  {id:"n-a1", cat:"autonomia", text:"Un docente integra un proyecto de aula sobre economía solidaria en el plan de área, en coherencia con el PEI institucional."},
  {id:"n-a2", cat:"autonomia", text:"La institución introduce la asignatura optativa «Historia regional del Tolima» dentro del área de Ciencias Sociales."},
  {id:"n-a3", cat:"autonomia", text:"En un municipio cafetero, la institución adapta el plan de Sociales para estudiar la economía del café en la región."},
  {id:"n-a4", cat:"autonomia", text:"El consejo académico adopta el aprendizaje basado en proyectos como metodología del área de Ciencias Sociales."},
  {id:"n-a5", cat:"autonomia", text:"La institución organiza un festival de memoria y patrimonio local como actividad formativa del área."},
  {id:"n-a6", cat:"autonomia", text:"El plan de estudios integra historia, geografía y constitución en una sola área de Ciencias Sociales organizada por proyectos."}
];

/* ---------- 5. Tarjetas de memoria ---------- */
const BANCO_TARJETAS = [
  {id:"t-abp", front:"Un docente presenta un problema real de la comunidad (la contaminación del río local) y deja que los estudiantes, en grupos, indaguen causas, recojan datos y propongan soluciones, mientras él actúa como guía.",
   back:"<b>Aprendizaje basado en problemas</b> (constructivismo social). Se articula con los Lineamientos Curriculares de Ciencias Sociales al situar el conocimiento en la resolución de problemas de la vida cotidiana."},
  {id:"t-signif", front:"Antes de explicar la Revolución Francesa, el docente pregunta qué saben sobre revoluciones y usa esas respuestas para conectar el nuevo contenido con lo que ya conocen.",
   back:"<b>Aprendizaje significativo</b> (Ausubel). El nuevo conocimiento se ancla en los saberes previos del estudiante."},
  {id:"t-critica", front:"El docente pide comparar dos versiones de un mismo hecho (un texto oficial y el testimonio de una comunidad afrocolombiana) y discutir qué voces quedan por fuera del relato oficial.",
   back:"<b>Pedagogía crítica</b> (Freire). Coincide con la perspectiva crítica de los Lineamientos, que buscan cuestionar las explicaciones únicas."},
  {id:"t-roles", front:"En vez de dar una definición cerrada de «ciudadanía», el docente organiza un juego de roles: los estudiantes representan un cabildo abierto y deben negociar decisiones.",
   back:"<b>Aprendizaje situado / juego de roles</b>. Trabaja las relaciones ético-políticas a partir de situaciones de participación."},
  {id:"t-pares", front:"Los estudiantes usan una rúbrica, con criterios explicados de antemano, para evaluar el trabajo de un compañero antes de entregarlo.",
   back:"<b>Coevaluación / evaluación formativa</b>. Responde al enfoque integral, flexible y formativo de la evaluación que exigen la Resolución 3842 y el Decreto 1290."},
  {id:"t-zdp", front:"El docente nota que un grupo aún no explica solo las causas de la Independencia, pero sí lo logra con preguntas guía. Poco a poco va retirando esas preguntas.",
   back:"<b>Andamiaje</b> (Wood, Bruner y Ross) dentro de la <b>zona de desarrollo próximo</b> (Vygotsky): apoyo que se retira a medida que el estudiante gana autonomía."},
  {id:"t-epc", front:"Antes de la unidad, la docente formula una pregunta generadora («¿por qué hay tierras sin campesinos y campesinos sin tierra?»), define metas de comprensión y planea desempeños con valoración continua.",
   back:"<b>Enseñanza para la Comprensión</b> (Proyecto Zero, Harvard). Encaja con el trabajo por preguntas problematizadoras que proponen los Lineamientos."},
  {id:"t-fuentes", front:"Los estudiantes de 9° comparan la carta de un soldado, un parte oficial y una caricatura de prensa sobre la Guerra de los Mil Días, y deben decir quién produjo cada una y con qué intención.",
   back:"<b>Análisis crítico de fuentes</b> (pensamiento histórico). Estándar de 8° a 9°: «Identifico las características básicas de los documentos que utilizo (qué tipo de documento es, quién es el autor, a quién está dirigido, de qué habla, por qué se produjo...)»."},
  {id:"t-cartografia", front:"Los estudiantes de 6° dibujan con sus familias el mapa de su vereda: fuentes de agua, caminos, lugares de encuentro y zonas de riesgo. Luego lo comparan con el mapa oficial.",
   back:"<b>Cartografía social</b>. Trabaja el estándar de 6° a 7° «Utilizo coordenadas, convenciones y escalas para trabajar con mapas y planos de representación» y vincula a la comunidad."},
  {id:"t-coop", front:"En cada grupo hay un relator, un verificador de fuentes, un moderador y un responsable del tiempo. La nota combina el producto común y el aporte individual.",
   back:"<b>Aprendizaje cooperativo</b> (Johnson y Johnson): interdependencia positiva y responsabilidad individual. Responde a la función de «construir ambientes que fomenten el aprendizaje autónomo y cooperativo» (Res. 3842)."},
  {id:"t-invertida", front:"Los estudiantes ven en casa un video corto sobre el Frente Nacional y en clase usan todo el tiempo para debatir y resolver un caso.",
   back:"<b>Aula invertida</b>. Libera la clase para tareas de mayor nivel, pero exige verificar el acceso a dispositivos y conectividad, sobre todo en zonas rurales."},
  {id:"t-dua", front:"Para un estudiante con baja visión, la docente prepara el mapa en relieve, con texto ampliado y descripción oral, y deja constancia de esos ajustes en un plan individual.",
   back:"<b>Ajustes razonables y Diseño Universal para el Aprendizaje</b>, registrados en el <b>PIAR</b> (Plan Individual de Ajustes Razonables), según el Decreto 1421 de 2017."},
  {id:"t-escuelanueva", front:"En una escuela rural multigrado, los niños avanzan con guías de autoaprendizaje a su propio ritmo, trabajan en mesas por grupos y tienen su propio gobierno estudiantil.",
   back:"<b>Escuela Nueva</b>: modelo educativo flexible colombiano para la ruralidad multigrado, con guías, aprendizaje activo y participación estudiantil."},
  {id:"t-caso", front:"La docente presenta el caso real de una comunidad que se opone a una mina y pide identificar actores, intereses, normas en juego y posibles salidas.",
   back:"<b>Estudio de caso</b>. Encaja con el estándar de 8° a 9° «Reconozco que los fenómenos sociales pueden observarse desde diversos puntos de vista (visiones e intereses)»."},
  {id:"t-memoria", front:"Los estudiantes de 11° entrevistan, con un protocolo de cuidado, a víctimas y excombatientes; contrastan los relatos y los relacionan con informes oficiales.",
   back:"<b>Pedagogía de la memoria</b>. Responde al estándar de 10° a 11° «Asumo una posición crítica frente a los procesos de paz que se han llevado a cabo en Colombia, teniendo en cuenta las posturas de las partes involucradas» y a la Cátedra de la Paz (Ley 1732 de 2014)."}
];

/* ---------- 6. Matriz de triangulación ---------- */
const COMPETENCIAS_COMP = ["Liderazgo","Comunicación y relaciones interpersonales","Trabajo en equipo","Negociación y mediación","Compromiso social e institucional","Iniciativa","Orientación al logro"];
const BANCO_TRIOS = [
  {id:"tr-normas", a:"En grado 7°, dos grupos se enfrentan verbalmente porque no se ponen de acuerdo sobre el uso del balón en el descanso. La docente detiene la discusión, escucha a cada grupo por turnos y los guía para redactar juntos un acuerdo que ambos firman.",
   b:"6° a 7°: «Participo en la construcción de normas para la convivencia en los grupos a los que pertenezco (familia, colegio, organización juvenil, equipos deportivos...)».",
   c:"Negociación y mediación"},
  {id:"tr-debate", a:"En un debate de grado 9° sobre la Constitución de 1991, un estudiante descalifica a otro por su postura política. El docente reformula la intervención, pide argumentos en lugar de etiquetas y muestra cómo responder a una idea sin atacar a la persona.",
   b:"8° a 9°: «Asumo una posición crítica frente a situaciones de discriminación y abuso por irrespeto a las posiciones ideológicas y propongo formas de cambiarlas».",
   c:"Comunicación y relaciones interpersonales"},
  {id:"tr-mapas", a:"Tras un diagnóstico, el docente de grado 5° descubre que la mitad del curso no logra ubicar fenómenos en el mapa con coordenadas. Rediseña la secuencia, añade práctica guiada con planos del barrio y vuelve a medir hasta que casi todos lo consiguen.",
   b:"4° a 5°: «Utilizo coordenadas, escalas y convenciones para ubicar los fenómenos históricos y culturales en mapas y planos de representación».",
   c:"Orientación al logro"},
  {id:"tr-tutela", a:"Sin que nadie se lo pida, una docente de grado 10° gestiona con la personería municipal una visita para que sus estudiantes conozcan cómo se tramita una tutela, y la integra a su unidad sobre derechos fundamentales.",
   b:"10° a 11°: «Identifico mecanismos e instituciones constitucionales que protegen los derechos fundamentales de los ciudadanos y las ciudadanas».",
   c:"Iniciativa"},
  {id:"tr-amazonia", a:"Los docentes de Sociales y de Ciencias Naturales de grado 11° planean juntos una unidad sobre la deforestación: acuerdan metas comunes, se reparten las sesiones y construyen una sola rúbrica.",
   b:"10° a 11°: «Explico y evalúo el impacto del desarrollo industrial y tecnológico sobre el medio ambiente y el ser humano».",
   c:"Trabajo en equipo"},
  {id:"tr-investigacion", a:"En la reunión de área, un docente propone que la investigación escolar sea el eje de Sociales en la media. Presenta los resultados de su piloto, escucha las objeciones y logra que el equipo acuerde un plan común.",
   b:"10° a 11°: «Realizo investigaciones como lo hacen los científicos sociales: diseño proyectos, desarrollo investigaciones y presento resultados».",
   c:"Liderazgo"},
  {id:"tr-desplazamiento", a:"Llegan al colegio varias familias desplazadas por la violencia. La docente de grado 11° apoya, fuera de su horario, la caracterización de los nuevos estudiantes y adapta su unidad para que el curso conozca los derechos que los protegen.",
   b:"10° a 11°: «Identifico causas y consecuencias de los procesos de desplazamiento forzado de poblaciones y reconozco los derechos que protegen a estas personas».",
   c:"Compromiso social e institucional"},
  {id:"tr-cultivo", a:"En una salida de campo de grado 4°, unos estudiantes entran sin permiso a un cultivo y el dueño reclama molesto. El docente escucha al campesino y a los niños por separado, y acuerdan juntos una forma de reparar el daño.",
   b:"4° a 5°: «Reconozco los diferentes usos que se le dan a la tierra y a los recursos naturales en mi entorno y en otros (parques naturales, ecoturismo, ganadería, agricultura…)».",
   c:"Negociación y mediación"}
];

/* ---------- 7. Reconstrucción normativa ---------- */
const BANCO_TEXTOS = [
{id:"tx-lineamientos", titulo:"Lineamientos y evaluación",
 partes:[
  {text:"La enseñanza de las Ciencias Sociales exige superar la transmisión fragmentada de contenidos y adoptar un enfoque de "},{blank:0},
  {text:", que articule las disciplinas sociales alrededor de problemas relevantes para los estudiantes. Este enfoque solo tiene sentido si se acompaña de una evaluación "},{blank:1},
  {text:", que valore el proceso y no únicamente el resultado final. A su vez, el desempeño del docente que orienta este proceso se valora, bajo el régimen del Decreto 1278 de 2002, mediante la evaluación de "},{blank:2},
  {text:", que analiza competencias funcionales y comportamentales. Nada de esto sustituye la "},{blank:3},
  {text:" del docente para adaptar sus estrategias al contexto real de sus estudiantes."}
 ],
 blancos:[
  {options:["ciencias sociales integradas","disciplinas separadas por asignatura","estándares mínimos de cobertura"], c:0,
   e:"Los Lineamientos Curriculares de Ciencias Sociales (MEN, 2002) proponen unas ciencias sociales integradas; la fragmentación por disciplinas es justamente lo que buscan superar."},
  {options:["exclusivamente numérica","formativa","estandarizada a nivel nacional"], c:1,
   e:"El Decreto 1290 de 2009 y la Resolución 3842 piden una evaluación integral, flexible y formativa, que valore el proceso."},
  {options:["coeficiente intelectual","clima organizacional","desempeño"], c:2,
   e:"El Decreto 1278 regula la evaluación de desempeño (periodo de prueba y evaluación anual), con base en competencias funcionales y comportamentales."},
  {options:["obediencia normativa estricta","improvisación sin planeación","autonomía pedagógica"], c:2,
   e:"La Ley 115 de 1994 reconoce la autonomía para adoptar métodos de enseñanza dentro del PEI; ni la obediencia mecánica ni la improvisación equivalen a ella."}
 ]},
{id:"tx-convivencia", titulo:"Ruta de convivencia",
 partes:[
  {text:"Cuando dos estudiantes tienen un altercado aislado, sin daño al cuerpo ni a la salud, el Decreto 1965 de 2013 lo clasifica como situación "},{blank:0},
  {text:", y su protocolo empieza por "},{blank:1},
  {text:". Si las burlas contra un mismo estudiante se repiten durante semanas sin constituir delito, la situación pasa a ser "},{blank:2},
  {text:" y deben informarse de inmediato los padres o acudientes. Cuando la agresión constituye un presunto delito, el presidente del Comité Escolar de Convivencia debe informar de inmediato a "},{blank:3},
  {text:". Todo el sistema descansa en la corresponsabilidad de la familia, la escuela, la sociedad y el Estado."}
 ],
 blancos:[
  {options:["Tipo I","Tipo II","Tipo III"], c:0,
   e:"El art. 40 del Decreto 1965 define el Tipo I: conflictos manejados inadecuadamente y situaciones esporádicas sin daño al cuerpo o a la salud."},
  {options:["la citación de los padres ante el Comité","la mediación pedagógica inmediata entre las partes","la remisión a la Comisaría de Familia"], c:1,
   e:"El protocolo Tipo I (art. 42) empieza por reunir de inmediato a las partes y mediar de manera pedagógica."},
  {options:["Tipo III","un conflicto manejado inadecuadamente","Tipo II"], c:2,
   e:"La repetición o sistematicidad, sin delito, es lo que define el Tipo II (art. 40)."},
  {options:["la Policía Nacional","la Secretaría de Educación","el ICBF"], c:0,
   e:"En el Tipo III, el art. 44 (num. 3) ordena al presidente del Comité informar a la Policía Nacional «de manera inmediata y por el medio más expedito»."}
 ]},
{id:"tx-manual", titulo:"Manual de funciones y autonomía",
 partes:[
  {text:"La Resolución 3842 de 2022 agrupa las competencias funcionales del docente de aula en tres áreas de gestión: académica, administrativa y "},{blank:0},
  {text:". A ellas se suman siete competencias "},{blank:1},
  {text:", como el liderazgo y la orientación al logro, que son marco de referencia para la evaluación en "},{blank:2},
  {text:" y para la evaluación anual de desempeño. En lo curricular, la Ley 115 de 1994 reconoce a las instituciones "},{blank:3},
  {text:" para organizar las áreas fundamentales, introducir asignaturas optativas y adaptar algunas áreas a las necesidades regionales."}
 ],
 blancos:[
  {options:["directiva","comunitaria","financiera"], c:1,
   e:"El docente de aula tiene tres áreas de gestión: académica, administrativa y comunitaria. La gestión directiva es propia de los directivos docentes."},
  {options:["comportamentales","funcionales","disciplinarias"], c:0,
   e:"Las siete competencias comportamentales son liderazgo; comunicación y relaciones interpersonales; trabajo en equipo; negociación y mediación; compromiso social e institucional; iniciativa, y orientación al logro."},
  {options:["ascenso en el escalafón","reubicación salarial","periodo de prueba"], c:2,
   e:"La disposición 3.6 de la Resolución 3842 las fija como marco para la evaluación en periodo de prueba y la evaluación ordinaria anual de desempeño (Decreto 1278)."},
  {options:["potestad reglamentaria","autonomía","competencia disciplinaria"], c:1,
   e:"Es la autonomía escolar del art. 77 de la Ley 115 de 1994."}
 ]}
];
