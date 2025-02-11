import {useEffect, useState} from "react";
import {toast} from "react-toastify";
import useGetAuditorias from './useGetAuditorias'
import EliminarLibMesModal from './EliminarLibMesModal'
import CardHeaderDatosAudit from './CardHeaderDatosAudit'
import RowLibMes from './RowLibMes'
import { useSelector, useDispatch } from 'react-redux'
import SelectAnioMes from "./SelectAnioMes";
import useGetLibrosMensuales from "./useGetLibrosMensuales";
import { putLibroMensual } from "./http/getLibrosMensuales";


const DatosAuditoria = ({history}) => {


    const [showDelModal, setShowDelModal] = useState(false)

    const auditorias = useSelector(state => state.auditoriasIglesia)
    const auditoriaActual = useSelector(state => state.auditoriaActual)
    const libMensuales = useSelector(state => state.libMensuales);
    const dispatch = useDispatch()
    
    const getAuditorias = useGetAuditorias()
    const [libMesSeleccionado, setLibMesSeleccionado] = useState(null)
    const getLibrosMensuales = useGetLibrosMensuales(auditoriaActual)


    useEffect(() => {
        getAuditorias();
    }, []);


    useEffect(() => {

        if (auditoriaActual.id) {
            getLibrosMensuales()
        }

    }, [auditoriaActual]);




    const handlerInputChange = (e, libMensual, tipo) => {

        const {value} = e.target
        libMensual[tipo] = value
        console.log({libMensual})


        const tempoLibros = libMensuales.map((libMens) => {
            return libMens.id === libMensual.id ? libMensual : libMens
        })
        putLibroMensual(libMensual)
        dispatch({type: 'set', libMensuales: tempoLibros})

    }

    const handleClickDeleteLibMes = async (libMensual) => {
        setLibMesSeleccionado(libMensual)
        setShowDelModal(true)

    }

    const deleteLibMes = async (libMensual) => {
        try {

            //await refFire.collection("lib_mensuales").doc(libMensual.id).delete();
            toast.info('Libro eliminado')
            getLibrosMensuales()
            setShowDelModal(false)

        } catch (error) {
            toast.error('Error al eliminar libro')
        }
    }


    return (
        <div>

            <CardHeaderDatosAudit auditorias={auditorias}/>

            <EliminarLibMesModal showDelModal={showDelModal}
                setShowDelModal={setShowDelModal}
                libMesSeleccionado={libMesSeleccionado}
                deleteLibMes={deleteLibMes}/>


            <div className="card">
                <div className="card-body">

                    <h5 className="card-title">Libros del mes</h5>

                    {
                    auditoriaActual.id ? <SelectAnioMes getLibrosMensuales={getLibrosMensuales}
                        auditoriaId={
                            auditoriaActual.id
                        }/> : 'Establezca auditoría actual.'
                }

                    <table className="table table-responsive table-condensed">
                        <thead>
                            <tr>
                                <th>Nro</th>
                                <th>Año</th>
                                <th>Mes</th>
                                <th>Diezmos</th>
                                <th>Ofrendas</th>
                                <th>Especial</th>
                                <th>Total</th>
                            </tr>
                        </thead>
                        <tbody>{
                            libMensuales ? (libMensuales.map((libMensual, index) => <RowLibMes key={
                                    libMensual.id
                                }
                                libMensual={libMensual}
                                index={index}
                                handlerInputChange={handlerInputChange}
                                handleClickDeleteLibMes={handleClickDeleteLibMes}/>)) : <tr>
                                <td>Nada aún</td>
                            </tr>
                        }</tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default DatosAuditoria;
