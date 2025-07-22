// validations/dynamicRules.js
import * as Yup from 'yup';


export const validateFields = async (formData, validationRules) => {
  const schema = Yup.object().shape(validationRules);

  try {
    await schema.validate(formData, { abortEarly: false });
    return { valid: true, errors: {} };
  } catch (err) {
    const errors = {};
    err.inner.forEach((e) => {
      errors[e.path] = e.message;
    });
    return { valid: false, errors };
  }
};

export const buildField = (rules = []) => {
  let schema;

  // Verifica si es campo numérico
  const isNumber = rules.includes('number');

  if (isNumber) {
    schema = Yup.number()
      .transform((value, originalValue) =>
        originalValue === '' ? undefined : value
      )
      .typeError('Debe ser un número');
  } else {
    schema = Yup.string().transform((value, originalValue) =>
      originalValue === '' ? undefined : value
    );
  }

  // Aplicar reglas
  for (const rule of rules) {
    if (rule === 'required') {
      schema = schema.required('Campo obligatorio');
    } else if (typeof rule === 'object') {
      if (rule.min !== undefined) {
        schema = schema.min(rule.min, `Debe ser mínimo ${rule.min}`);
      }
    }
  }

  return schema;
};


