import React, { useState, useEffect } from "react";
import {
  Modal,
  Form as formBostrap,
  Button as ButtonRB,
} from "react-bootstrap";
import * as Yup from "yup";
import {
  ErrorMessage,
  Field,
  FieldArray,
  Form,
  Formik,
  FormikConfig,
  FormikValues,
} from "formik";
import Product from "@Models/Product/Product";
import TextFieldValue from "../../../Inputs/TextFieldValue";
import TextFieldSelect from "../../../Inputs/TextFieldSelect";
import "./ModalAddProducts.scss";
import {
  Box,
  Grid,
  Step,
  StepLabel,
  Stepper,
  Button,
  Typography,
} from "@mui/material";
import TextAreaValue from "components/Inputs/TextAreaValue";
import { useAppSelector, useAppDispatch } from "@app/Hooks";
import { startLoading, finishLoading } from "@features/Loading/LoadingSlice";
import Loading from "components/Loading/Loading";
import ProductDetail from "@Models/Product/ProductDetail";
import Ingredient from "@Models/Product/Ingredient";
import { getData, postPutData } from "components/GenericFetch/GenericFetch";
import TextCheckBox from "components/Inputs/TextCheckBox";
import TextFildSelectValue from "components/Inputs/TextFildSelectValue";
import { addProduct, updateProduct } from "@features/ProductSlice/ProductSlice";



const emptyIngredient: Ingredient =
{
  id: 0,
  name: "",
  ingredientCategory: { name: "" },
  minimumStock: "",
  currentStock: "",
  measurementUnit: "",
  costPrice: "",
};

const emptyDonation: ProductDetail = {
  ingredient: emptyIngredient,
  quantity: "",
  measurementUnit: "",
};

interface Props {
  showModal: boolean;
  handleClose: () => void;
  editing?: boolean;
  product?: Product;
}


const ModalAddProducts = ({
  showModal,
  handleClose,
  editing,
  product,
}: Props) => {

  const initialValues: Product = {
    name: "",
    productCategory: { description: "" },
    sellPrice: "",
    cookingTime: "",
    recipe: { description: "" },
    description: "",
    shortDescription: "",
    available: true,
    image: { name: "", path: "" },
    productDetails: [emptyDonation],
  };

  const loading = useAppSelector((state) => state.loading);
  const dispatch = useAppDispatch();
  return (
    <div>
      {loading ? <Loading /> : <></>}
      <Modal
        id={"modal"}
        show={showModal}
        onHide={handleClose}
        size={"lg"}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          {editing ? (
            <Modal.Title>Editar un Producto:</Modal.Title>
          ) : (
            <Modal.Title>Añadir un Producto:</Modal.Title>
          )}
        </Modal.Header>
        <Modal.Body>
          <div>
            <FormikStepper
              initialValues={product ? product : initialValues}
              onSubmit={(values) => {
                console.log(values);
                const valuesProduct: Product = {
                  name: values.name,
                  description: values.description,
                  shortDescription: values.shortDescription,
                  productCategory: values.productCategory,
                  productDetails: values.productDetails,
                  available: values.available,
                  sellPrice: values.sellPrice,
                  cookingTime: values.cookingTime,
                  image: { name: "", path: "" },
                  recipe: values?.recipe
                }
                console.log("values", valuesProduct)
                if (editing) {
                  dispatch(startLoading())
                  postPutData(`/api/product`, "PUT", values).then(
                    () => {
                      dispatch(updateProduct(valuesProduct))
                    }
                  )
                  dispatch(finishLoading())
                } else {
                  postPutData(`/api/product`, "POST", values).then(
                    () => {
                      dispatch(addProduct(valuesProduct))
                    }
                  )
                }
                handleClose();

              }}
            >
              <FormikStep
                label="Datos del producto"
                validationSchema={Yup.object({
                  name: Yup.string().required("*Campo requerido"),
                  productCategory: Yup.object().shape({
                    id: Yup.number(),
                    description: Yup.string(),
                    deleted: Yup.boolean()
                  }),
                  sellPrice: Yup.number().required("*Campo requerido"),
                  cookingTime: Yup.number().required("*Campo requerido"),
                  available: Yup.boolean().required("*Campo requerido"),
                  shortDescription: Yup.string().required("*Campo requerido"),
                  description: Yup.string().required("*Campo requerido"),
                })}
              >

              </FormikStep>

              <FormikStep
                label="Ingredientes"
                validationSchema={Yup.object({
                  productDetails: Yup.array(
                    Yup.object({
                      ingredient: Yup.object().shape({
                        name: Yup.string().required("Campo Requerido"),
                        ingredientCategory: Yup.object().shape({
                          id: Yup.number().required(),
                          name: Yup.string().required("Campo Requerido"),
                        }),
                        minimumStock: Yup.number(),
                        currentStock: Yup.number(),
                        measurementUnit: Yup.string(),
                        costPrice: Yup.number(),
                      }).required("Campo Requerido"),
                      quantity: Yup.number().required("Campo Requerido"),
                      measurementUnit: Yup.string().required("Campo Requerido"),
                    })
                  ).min(1, "Tiene que tener al menos un ingrediente"),
                })}
              ></FormikStep>

              <FormikStep
                label="Receta"
                validationSchema={
                  Yup.object({
                    // recipe: Yup.object().shape({
                    //   // description: Yup.string().notRequired(),
                    // }),
                  })}
              >
                <>
                  <TextAreaValue
                    label="Receta"
                    name="recipe.description"
                    placeholder="Receta"
                  />
                </>
              </FormikStep>
            </FormikStepper>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default ModalAddProducts;

export interface FormikStepProps
  extends Pick<FormikConfig<FormikValues>, "children" | "validationSchema"> {
  label: string;
  valuesOptions?: any;
}

export function FormikStep({ children }: FormikStepProps) {
  return <>{children}</>;
}

interface PropsForm extends FormikConfig<FormikValues> {
  children: React.ReactNode;
  valuesOptions?: any;
}

export function FormikStepper({
  children,
  valuesOptions,
  ...props
}: PropsForm) {
  const childrenArray = React.Children.toArray(
    children
  ) as React.ReactElement<FormikStepProps>[];
  const [step, setStep] = useState(0);
  const currentChild = childrenArray[step];
  const [completed, setCompleted] = useState(false);
  function isLastStep() {
    return step === childrenArray.length - 1;
  }

  const { ProductCategory } = useAppSelector(state => state.productCategories)
  const [options, setOptions] = useState<any>([])

  function categorysProdToOptions() {
    const initialopcions = {
      value: "todos",
      label: "",
    };
    setOptions([
      initialopcions,
      ...ProductCategory.map((option, index) => ({
        value: option.id?.toString(),
        label: option.description,
      })),
    ]);
  }


  useEffect(() => {
    categorysProdToOptions()
  }, [ProductCategory]);

  const { Ingredients } = useAppSelector((state) => state.ingredients);

  const [optionsIngredients, setOptionsIngredients] = useState<any>([]);
  function categorysToOptions() {
    const initialopcions = {
      value: "",
      label: "",
    };
    setOptionsIngredients([
      initialopcions,
      ...Ingredients.map((option, index) => ({
        value: option.id?.toString(),
        label: option.name,
      })),
    ]);
  }

  useEffect(() => {
    categorysToOptions();
  }, [Ingredients]);

  const [mesureUnit, setMesureUnit] = useState<string[]>([""])
  const [optionsMesureUnit, setOptionsMesureUnit] = useState<any>([]);

  function unitsToOptions() {
    console.log(mesureUnit)
    const initialopcions = {
      value: "",
      label: "",
    };
    setOptionsMesureUnit([
      initialopcions,
      ...mesureUnit.map((option, index) => ({
        value: option,
        label: option
      })),
    ]);
  }


  async function getMesureUnit() {
    const data: string[] = await getData<string[]>("/api/enum/units")
    setMesureUnit(data)
    unitsToOptions()
  }

  useEffect(() => {
    getMesureUnit()
  }, [Ingredients])

  return (
    <Formik
      {...props}
      validationSchema={currentChild.props.validationSchema}
      onSubmit={async (values, helpers) => {
        if (isLastStep()) {
          await props.onSubmit(values, helpers);
          setCompleted(true);
        } else {
          setStep((s) => s + 1);
          helpers.setTouched({});
        }
      }}
    >
      {({ values, errors, isSubmitting, setFieldValue }) => (
        <Form autoComplete="off">
          <Stepper alternativeLabel activeStep={step}>
            {childrenArray.map((child, index) => (
              <Step
                key={child.props.label}
                completed={step > index || completed}
              >
                <StepLabel>{child.props.label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {step === 0 ? (
            <div className="container_Form_Productos">
              <TextFieldValue
                label="Nombre"
                name="name"
                placeholder="Nombre"
                type="text"
              />
              <TextFildSelectValue
                label="Rubro:"
                name="productCategory"
                options={options}
                value={values.productCategory.id}
                onChange={(event: any) => {
                  let prod = ProductCategory.filter((product) => {
                    return product.id?.toString() == event.target.value
                  })
                  if (prod.length === 0) {
                    prod = [{ description: "" }]
                  }
                  setFieldValue(`productCategory`, prod[0]);
                }}
              />
              <TextFieldValue
                label="PrecioVenta"
                name="sellPrice"
                placeholder="PrecioVenta"
                type="number"
              />
              <TextFieldValue
                label="TiempoCocina"
                name="cookingTime"
                placeholder="TiempoCocina"
                type="number"
              />

              <TextAreaValue
                label="Descripcion"
                name="description"
                placeholder="Descripcion"
              />
              <TextAreaValue
                label="Descripcion Corta"
                name="shortDescription"
                placeholder="Descripcion corta"
              />
              <TextCheckBox
                label="Disponible"
                name="available"
                placeholder="TiempoCocina"
              />

            </div>

          ) : <></>}


          {step === 1 ? (
            <FieldArray name="productDetails">
              {({ push, remove }) => (
                <React.Fragment>
                  {values.productDetails.map((ingre: any, index: any) => (
                    <Grid container item key={index} spacing={2}>
                      <Grid item>
                        <TextFildSelectValue
                          label="Ingrediente:"
                          name={`productDetails.${index}.ingredient`}
                          options={optionsIngredients}
                          onChange={(event: any) => {
                            let ingredient = Ingredients.filter((ingre) => {
                              return ingre.id?.toString() == event.target.value
                            })
                            if (ingredient.length === 0) {
                              ingredient = [emptyIngredient]
                            }
                            setFieldValue(`productDetails.${index}.ingredient`, ingredient[0]);
                          }}
                          value={values.productDetails[index].ingredient.id.toString()}

                        />
                      </Grid>

                      <Grid item>
                        <TextFieldValue
                          value={ingre?.Cuantity}
                          label="Cantidad:"
                          name={`productDetails.${index}.quantity`}
                          type="number"
                          placeholder="Cantidad"
                        />
                      </Grid>

                      <Grid item>
                        <TextFieldSelect
                          label="Unidad de medida:"
                          name={`productDetails.${index}.measurementUnit`}
                          options={optionsMesureUnit}
                        />
                      </Grid>

                      <Grid item alignSelf={"center"}>
                        <ButtonRB
                          variant="success"
                          disabled={isSubmitting}
                          onClick={() => remove(index)}
                        >
                          Delete
                        </ButtonRB>
                      </Grid>
                    </Grid>
                  ))}
                  <Grid item>
                    {typeof errors.donations === "string" ? (
                      <Typography color="error">{errors.donations}</Typography>
                    ) : null}
                  </Grid>

                  <ButtonRB
                    disabled={isSubmitting}
                    variant="success"
                    style={{ marginBottom: "1rem" }}
                    onClick={() => push(emptyDonation)}
                  >
                    Añadir Ingredientes
                  </ButtonRB>
                </React.Fragment>
              )}
            </FieldArray>
          ) : (
            <></>
          )}



          {currentChild}

          <Grid container spacing={2} style={{ marginTop: "1rem" }}>
            {step > 0 ? (
              <Grid item>
                <Button
                  disabled={isSubmitting}
                  variant="contained"
                  color="primary"
                  onClick={() => setStep((s) => s - 1)}
                >
                  Back
                </Button>
              </Grid>
            ) : null}
            <Grid item>
              <Button
                disabled={isSubmitting}
                variant="contained"
                color="primary"
                type="submit"
              >
                {isSubmitting ? "Submitting" : isLastStep() ? "Submit" : "Next"}
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
  );
}
