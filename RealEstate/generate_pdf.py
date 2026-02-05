from fpdf import FPDF
from fpdf.enums import XPos, YPos

class PDF(FPDF):
    def header(self):
        self.set_font('Helvetica', 'B', 18)
        self.set_text_color(41, 128, 185)
        self.cell(0, 15, 'Formulario de Edicion de Vivienda', new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='C')
        self.set_font('Helvetica', '', 10)
        self.set_text_color(127, 140, 141)
        self.cell(0, 8, 'Documentacion tecnica - Angular Real Estate App', new_x=XPos.LMARGIN, new_y=YPos.NEXT, align='C')
        self.line(10, self.get_y() + 2, 200, self.get_y() + 2)
        self.ln(8)

    def footer(self):
        self.set_y(-15)
        self.set_font('Helvetica', 'I', 8)
        self.set_text_color(127, 140, 141)
        self.cell(0, 10, f'Pagina {self.page_no()}/{{nb}}', align='C')

    def section_title(self, title):
        self.set_font('Helvetica', 'B', 14)
        self.set_text_color(44, 62, 80)
        self.cell(0, 10, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.set_draw_color(41, 128, 185)
        self.line(10, self.get_y(), 80, self.get_y())
        self.ln(4)

    def subsection_title(self, title):
        self.set_font('Helvetica', 'B', 11)
        self.set_text_color(52, 73, 94)
        self.cell(0, 8, title, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(2)

    def body_text(self, text):
        self.set_font('Helvetica', '', 10)
        self.set_text_color(44, 62, 80)
        self.multi_cell(0, 6, text)
        self.ln(3)

    def code_block(self, code):
        self.set_font('Courier', '', 8)
        self.set_fill_color(240, 240, 240)
        self.set_text_color(44, 62, 80)
        lines = code.split('\n')
        block_height = len(lines) * 5 + 6
        if self.get_y() + block_height > 270:
            self.add_page()
        self.rect(10, self.get_y(), 190, block_height, 'F')
        self.ln(3)
        for line in lines:
            self.cell(5)
            self.cell(0, 5, line, new_x=XPos.LMARGIN, new_y=YPos.NEXT)
        self.ln(5)

    def bullet_point(self, text, indent=10):
        self.set_font('Helvetica', '', 10)
        self.set_text_color(44, 62, 80)
        self.cell(indent)
        self.cell(5, 6, '-')
        self.multi_cell(170 - indent, 6, text)
        self.ln(1)

    def file_change_row(self, filename, action, description):
        self.set_font('Courier', '', 8)
        self.set_fill_color(235, 245, 251)
        self.set_text_color(44, 62, 80)
        self.cell(70, 7, filename, border=1, fill=True)
        self.set_font('Helvetica', 'B', 8)
        if action == 'CREAR':
            self.set_text_color(39, 174, 96)
        else:
            self.set_text_color(41, 128, 185)
        self.cell(20, 7, action, border=1, align='C')
        self.set_font('Helvetica', '', 8)
        self.set_text_color(44, 62, 80)
        self.cell(100, 7, description, border=1, new_x=XPos.LMARGIN, new_y=YPos.NEXT)


pdf = PDF()
pdf.alias_nb_pages()
pdf.set_auto_page_break(auto=True, margin=25)
pdf.add_page()

# ============================================================
# 1. INTRODUCCION
# ============================================================
pdf.section_title('1. Introduccion')
pdf.body_text(
    'Este documento detalla la implementacion de la funcionalidad de edicion de viviendas '
    'en la aplicacion Angular Real Estate. Se ha creado un componente reutilizable (HousingForm) '
    'que funciona tanto para crear como para editar propiedades, detectando automaticamente '
    'el modo segun la ruta activa.'
)

pdf.subsection_title('Tecnologias utilizadas')
pdf.bullet_point('Angular 21 (Standalone Components)')
pdf.bullet_point('Reactive Forms (FormGroup, FormControl, Validators)')
pdf.bullet_point('HttpClient para peticiones HTTP (POST y PUT)')
pdf.bullet_point('json-server como backend REST (soporta GET, POST, PUT nativamente)')
pdf.bullet_point('Router de Angular para navegacion entre paginas')
pdf.ln(3)

# ============================================================
# 2. ARCHIVOS MODIFICADOS/CREADOS
# ============================================================
pdf.section_title('2. Archivos Modificados y Creados')
pdf.body_text('La siguiente tabla resume todos los archivos involucrados en la implementacion:')

# Table header
pdf.set_font('Helvetica', 'B', 8)
pdf.set_fill_color(41, 128, 185)
pdf.set_text_color(255, 255, 255)
pdf.cell(70, 7, 'Archivo', border=1, fill=True, align='C')
pdf.cell(20, 7, 'Accion', border=1, fill=True, align='C')
pdf.cell(100, 7, 'Descripcion', border=1, fill=True, align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)

# Table rows
pdf.file_change_row('housing-form/housing-form.ts', 'CREAR', 'Componente con form de creacion y edicion')
pdf.file_change_row('housing-form/housing-form.css', 'CREAR', 'Estilos del formulario (vacio, usa Bootstrap)')
pdf.file_change_row('resilient-housing-service.ts', 'MODIFICAR', 'Nuevo metodo updateHousingLocation (PUT)')
pdf.file_change_row('housing-provider.ts', 'MODIFICAR', 'Firma updateHousingLocation en interfaz')
pdf.file_change_row('routes.ts', 'MODIFICAR', 'Rutas /new y /edit/:id')
pdf.file_change_row('details/details.ts', 'MODIFICAR', 'Enlace "Edit Property" con RouterLink')
pdf.file_change_row('details/details.css', 'MODIFICAR', 'Estilo .edit-link')
pdf.ln(5)

# ============================================================
# 3. COMO FUNCIONA EL MODO EDICION
# ============================================================
pdf.section_title('3. Como Funciona el Modo Edicion')
pdf.body_text(
    'El componente HousingForm detecta si esta en modo creacion o edicion '
    'revisando si la ruta tiene un parametro :id. La logica es la siguiente:'
)

pdf.subsection_title('3.1 Deteccion del modo')
pdf.body_text(
    'En el constructor del componente se lee route.snapshot.params["id"]. '
    'Si existe, se activa isEditMode = true y se guarda el ID.'
)
pdf.code_block(
    'constructor() {\n'
    '  const idParam = this.route.snapshot.params["id"];\n'
    '  if (idParam) {\n'
    '    this.isEditMode = true;\n'
    '    this.housingLocationId = parseInt(idParam, 10);\n'
    '    this.loadHousingLocation();\n'
    '  }\n'
    '}'
)

pdf.subsection_title('3.2 Carga de datos existentes')
pdf.body_text(
    'Se llama a getHousingLocationById() del servicio para obtener la vivienda '
    'y luego se usa patchValue() para pre-rellenar todos los campos del formulario '
    'con los datos actuales. Esto incluye nombre, ciudad, estado, foto, precio, '
    'unidades, coordenadas, wifi, lavanderia y disponibilidad.'
)
pdf.code_block(
    'private loadHousingLocation() {\n'
    '  this.resilientHousingService\n'
    '    .getHousingLocationById(this.housingLocationId)\n'
    '    .then(location => {\n'
    '      if (location) {\n'
    '        this.housingForm.patchValue({\n'
    '          name: location.name,\n'
    '          city: location.city,\n'
    '          state: location.state,\n'
    '          // ... resto de campos\n'
    '        });\n'
    '      }\n'
    '    });\n'
    '}'
)

pdf.subsection_title('3.3 Envio del formulario (Submit)')
pdf.body_text(
    'En onSubmit(), se construye el objeto house con los valores del formulario. '
    'Dependiendo del modo:'
)
pdf.bullet_point('Modo CREACION: Se hace http.post() a http://localhost:3000/locations')
pdf.bullet_point('Modo EDICION: Se hace http.put() a http://localhost:3000/locations/:id')
pdf.body_text(
    'Tras una edicion exitosa, se muestra un mensaje de exito y se redirige '
    'automaticamente a la pagina de detalles (/details/:id) despues de 2 segundos.'
)

pdf.code_block(
    'if (this.isEditMode) {\n'
    '  this.http.put(\n'
    '    `http://localhost:3000/locations/${this.housingLocationId}`,\n'
    '    house\n'
    '  ).subscribe({ next: ..., error: ... });\n'
    '} else {\n'
    '  this.http.post(\n'
    '    "http://localhost:3000/locations",\n'
    '    house\n'
    '  ).subscribe({ next: ..., error: ... });\n'
    '}'
)

# ============================================================
# 4. SERVICIO - METODO PUT
# ============================================================
pdf.section_title('4. Metodo updateHousingLocation en el Servicio')
pdf.body_text(
    'Se agrego el metodo updateHousingLocation al ResilientHousingService. '
    'Este metodo realiza una peticion PUT usando fetch() (consistente con el '
    'patron existente del servicio) al endpoint del json-server.'
)
pdf.code_block(
    'async updateHousingLocation(\n'
    '  id: number,\n'
    '  location: HousingLocationInfo\n'
    '): Promise<HousingLocationInfo> {\n'
    '  const response = await fetch(\n'
    '    `${this.apiUrl}/${id}`, {\n'
    '      method: "PUT",\n'
    '      headers: {\n'
    '        "Content-Type": "application/json"\n'
    '      },\n'
    '      body: JSON.stringify(location),\n'
    '    }\n'
    '  );\n'
    '  if (!response.ok) {\n'
    '    throw new Error("Error al actualizar");\n'
    '  }\n'
    '  return await response.json();\n'
    '}'
)

pdf.body_text(
    'NOTA: A diferencia de las lecturas (GET), las escrituras (PUT) NO tienen '
    'fallback a datos locales, ya que no es posible escribir en un archivo '
    'estatico desde el navegador. Si el servidor no esta activo, se muestra '
    'un mensaje de error al usuario.'
)

# ============================================================
# 5. RUTAS
# ============================================================
pdf.section_title('5. Configuracion de Rutas')
pdf.body_text(
    'Se registraron dos nuevas rutas en routes.ts, ambas apuntando al '
    'mismo componente HousingForm pero con diferente configuracion:'
)

pdf.code_block(
    '{ path: "new",       component: HousingForm,\n'
    '  title: "New House" },\n'
    '\n'
    '{ path: "edit/:id",  component: HousingForm,\n'
    '  title: "Edit House" }'
)

pdf.bullet_point('/new -> Formulario vacio, modo creacion (POST)')
pdf.bullet_point('/edit/:id -> Formulario pre-rellenado, modo edicion (PUT)')
pdf.ln(3)

# ============================================================
# 6. ENLACE EN DETAILS
# ============================================================
pdf.section_title('6. Enlace de Edicion en la Pagina de Detalles')
pdf.body_text(
    'Se modifico el componente Details para incluir un enlace "Edit Property" '
    'que navega a /edit/:id. Para esto se importo RouterLink de @angular/router '
    'y se agrego al array de imports del componente.'
)

pdf.code_block(
    '<!-- En el template de details.ts -->\n'
    '<a [routerLink]="[\'/edit\', housingLocation?.id]"\n'
    '   class="edit-link">Edit Property</a>'
)

pdf.body_text(
    'El enlace aparece debajo del nombre y ubicacion de la vivienda, '
    'con un estilo discreto que se subraya al pasar el cursor.'
)

# ============================================================
# 7. FLUJO COMPLETO
# ============================================================
pdf.section_title('7. Flujo Completo del Usuario')
pdf.body_text('El flujo para editar una vivienda es el siguiente:')
pdf.ln(2)

steps = [
    '1. El usuario navega al Home (/) y ve la lista de viviendas.',
    '2. Hace click en "Learn More" de una vivienda -> va a /details/:id.',
    '3. En la pagina de detalles, ve el enlace "Edit Property".',
    '4. Click en "Edit Property" -> navega a /edit/:id.',
    '5. El formulario carga con los datos actuales pre-rellenados.',
    '6. El usuario modifica los campos deseados.',
    '7. Click en "Update House" -> se envia PUT al servidor.',
    '8. Se muestra mensaje de exito y redirige a /details/:id.',
]
for step in steps:
    pdf.bullet_point(step)

pdf.ln(3)

# ============================================================
# 8. CAMPOS DEL FORMULARIO
# ============================================================
pdf.section_title('8. Campos del Formulario')
pdf.body_text('El formulario incluye todos los campos de la interfaz HousingLocationInfo:')

# Fields table
pdf.set_font('Helvetica', 'B', 8)
pdf.set_fill_color(41, 128, 185)
pdf.set_text_color(255, 255, 255)
pdf.cell(40, 7, 'Campo', border=1, fill=True, align='C')
pdf.cell(25, 7, 'Tipo', border=1, fill=True, align='C')
pdf.cell(30, 7, 'Validacion', border=1, fill=True, align='C')
pdf.cell(95, 7, 'Descripcion', border=1, fill=True, align='C', new_x=XPos.LMARGIN, new_y=YPos.NEXT)

fields = [
    ('name', 'text', 'Requerido', 'Nombre de la propiedad'),
    ('city', 'text', 'Requerido', 'Ciudad donde se ubica'),
    ('state', 'text', 'Requerido', 'Estado/Provincia'),
    ('photo', 'url', 'Opcional', 'URL de la foto exterior'),
    ('availableUnits', 'number', 'Min: 1', 'Unidades disponibles'),
    ('price', 'number', 'Requerido', 'Precio de la propiedad'),
    ('wifi', 'checkbox', '-', 'Tiene wifi'),
    ('laundry', 'checkbox', '-', 'Tiene lavanderia'),
    ('available', 'checkbox', '-', 'Disponible actualmente'),
    ('latitude', 'number', 'Opcional', 'Coordenada latitud'),
    ('longitude', 'number', 'Opcional', 'Coordenada longitud'),
]

for f in fields:
    pdf.set_font('Courier', '', 8)
    pdf.set_text_color(44, 62, 80)
    pdf.set_fill_color(250, 250, 250)
    pdf.cell(40, 6, f[0], border=1, fill=True)
    pdf.set_font('Helvetica', '', 8)
    pdf.cell(25, 6, f[1], border=1, align='C')
    pdf.cell(30, 6, f[2], border=1, align='C')
    pdf.cell(95, 6, f[3], border=1, new_x=XPos.LMARGIN, new_y=YPos.NEXT)

pdf.ln(5)

# ============================================================
# 9. COMO PROBAR
# ============================================================
pdf.section_title('9. Como Probar')
pdf.body_text('Para probar la funcionalidad de edicion:')
pdf.ln(2)
pdf.bullet_point('1. Iniciar json-server: npx json-server db.json')
pdf.bullet_point('2. Iniciar Angular: ng serve')
pdf.bullet_point('3. Ir a http://localhost:4200')
pdf.bullet_point('4. Click en "Learn More" de cualquier vivienda')
pdf.bullet_point('5. Click en "Edit Property"')
pdf.bullet_point('6. Modificar campos y click en "Update House"')
pdf.bullet_point('7. Verificar que los cambios se reflejan en /details/:id')
pdf.ln(3)

pdf.body_text(
    'IMPORTANTE: El servidor json-server debe estar activo para que las '
    'operaciones de escritura (POST/PUT) funcionen. Las lecturas pueden '
    'funcionar con el fallback local (db.json en assets), pero las escrituras '
    'requieren el servidor corriendo.'
)

# Save
output_path = r'D:\TutorialRealEstate\RealEstate\Documentacion_Edicion_Vivienda.pdf'
pdf.output(output_path)
print(f'PDF generado en: {output_path}')
