import Category from '@Models/Product/Category';
import TextFieldSelect from 'components/Inputs/TextFieldSelect';
import TextFieldValue from 'components/Inputs/TextFieldValue';
import { Form, Formik } from 'formik'
import React, { ChangeEvent, useEffect, useState } from 'react'
import { Button, Modal } from 'react-bootstrap'
import * as Yup from "yup"
import Categories from '../Categories';
import { useAppDispatch, useAppSelector } from '@app/Hooks';
import { finishLoading, startLoading } from '@features/Loading/LoadingSlice';
import Loading from 'components/Loading/Loading';
import TextFildSelectValue from 'components/Inputs/TextFildSelectValue';



interface Props {
  showModal: boolean;
  handleClose: () => void;
  editing?: boolean;
  category?: Category;
}



export default function ModalAddCategories({ showModal, handleClose, editing, category }: Props) {
  const initialValues: Category = {
    name: "",
    parentCategory: { name: "" }
  }
  const { IngredientsCategories } = useAppSelector(state => state.ingredintsCategories)
  const [options, setOptions] = useState<any>([])

  function categorysToOptions() {
    const initialopcions = {
      value: "todos",
      label: "",
    };
    setOptions([
      initialopcions,
      ...IngredientsCategories.map((option, index) => ({
        value: option.id?.toString(),
        label: option.name,
      })),
    ]);
  }
  useEffect(() => {
    categorysToOptions()
  }, [IngredientsCategories]);

  const loading = useAppSelector((state) => state.loading.value);
  const dispatch = useAppDispatch()
  return (
    <div>
      <Loading />
      <Modal id={"modal"} show={showModal} onHide={handleClose} size={"lg"} backdrop="static"
        keyboard={false} >
        <Modal.Header closeButton>
          {editing ?
            <Modal.Title>Editar un Ingrediente:</Modal.Title> :
            <Modal.Title>Añadir un Ingrediente:</Modal.Title>
          }
        </Modal.Header>
        <Modal.Body>
          <Formik
            validationSchema={Yup.object({
              name: Yup.string().required("*Campo requerido"),
            })}
            initialValues={category ? category : initialValues}
            enableReinitialize={true}
            onSubmit={async (values) => {
              dispatch(startLoading())
              setTimeout(() => {
                console.log(values);
                handleClose();
                dispatch(finishLoading())
              }, 1000);
            }}
          >
            {(Formik) =>
            (
              <>
                <Form autoComplete="off" className="form-obraAlta">
                  <div className='container_Form_Ingredientes' >

                    <TextFieldValue
                      label="Nombre:"
                      name="name"
                      type="text"
                      placeholder="Nombre del Rubro"
                    />

                    <TextFildSelectValue
                      value={category?.parentCategory?.id}
                      label="Rubro padre:"
                      name="parentCategory"
                      options={options}
                      onChange={(event: any) => {
                        let ingredient = IngredientsCategories.filter((ingre) => {
                          return ingre.id?.toString() == event.target.value
                        })
                        if (ingredient.length === 0) {
                          ingredient = [{ name: "" }]
                        }
                        Formik.setFieldValue(`parentCategory`, ingredient[0]);
                      }}
                    />

                  </div>
                  <div className="d-flex justify-content-end">
                    <Button variant="success" type="submit" >
                      Enviar
                    </Button>
                  </div>
                </Form>
              </>
            )
            }
          </Formik>
        </Modal.Body>
      </Modal>
    </div >
  )
}
