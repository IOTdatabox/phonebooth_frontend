import React from "react"

const Terms = ({ close }) => {
    return (
        <div className='absolute top-0 left-0 h-full w-full z-10 px-4 py-8 bg-white rounded-[15px] flex flex-col gap-4'>
            <h2 className=' text-emerald-700 text-2xl font-bold '>Términos y Condiciones</h2>
            <h6 className=' text-cyan-950 text-lg font-bold '>Términos</h6>

            <div className='h-[410px] overflow-y-scroll'>
                <p className=' text-justify text-neutral-500 text-lg font-normal  leading-relaxed'>
                    1. Aceptación de los Términos Al descargar y utilizar esta aplicación, usted acepta estar sujeto a estos términos y condiciones. Si no está de acuerdo con ellos, por favor no use la aplicación.
                    <br />
                    <br />
                    2. Uso Apropiado Esta aplicación está destinada exclusivamente para usuarios mayores de edad legal para consumir bebidas alcohólicas en su país de residencia. Usted acepta usar la aplicación solo para fines legales y de manera que no infrinja los derechos de, restrinja o inhiba el uso y disfrute de la aplicación por parte de terceros.
                    <br />
                    <br />
                    3. Propiedad Intelectual Todo el contenido incluido en la aplicación, como textos, gráficos, logos, imágenes, así como la compilación de estos, es propiedad de Pernod Ricard o sus licenciantes y está protegido por leyes de derechos de autor y marcas registradas.
                    <br />
                    <br />
                    4. Limitación de Responsabilidad Pernod Ricard no se hace responsable de ningún daño directo, indirecto, incidental, especial o consecuente que resulte del uso o la incapacidad de usar esta aplicación.
                    <br />
                    <br />
                    5. Privacidad Su privacidad es importante para nosotros. Por favor, revise nuestra Política de Privacidad, que también rige su uso de la aplicación, para entender nuestras prácticas.
                    <br />
                    6. Cambios en los Términos Pernod Ricard se reserva el derecho de modificar estos términos y condiciones en cualquier momento. Se considerará que usted acepta dichos cambios si continúa utilizando la aplicación después de que se hayan publicado.
                    <br />
                    7. Legislación Aplicable Estos términos se regirán e interpretarán de acuerdo con las leyes del país donde Pernod Ricard tiene su sede principal, sin dar efecto a ningún principio de conflictos de leyes.
                    <br />
                    8. Contacto Si tiene alguna pregunta sobre estos términos, por favor contacte a [correo electrónico/medio de contacto].
                </p>
            </div>
            <div className='flex items-center justify-between'>
                <span className='flex gap-2 items-center'>
                    <input className='text-lg' type='checkbox' name='terms' />
                    <p className=" text-justify text-black text-[17px] font-medium font-['Roboto Flex'] leading-relaxed">Confirmo que he leído y acepto los términos y condiciones y la política de privacidad.</p>
                </span>
                <span>
                    <button onClick={() => close()} className=' text-emerald-700 text-lg font-medium py-2 px-8'>
                        Cancelar
                    </button>
                    <button onClick={() => close()} className='bg-emerald-700 rounded-lg justify-center items-center inline-flex text-white py-2 px-8 font-semibold '>
                        Aceptar
                    </button>
                </span>
            </div>
        </div>
    )
}

export default Terms
