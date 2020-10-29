# Polaris Form Builder

_Build forms in your Shopify Polaris apps with a simple config object._

This package enables you to build complex forms in your Shopify applications without a load of messy template boilerplate. Simply configure the fields you want on your form as a plain javascript array and the Form Builder will take care of displaying the fields and updating the values.

It supports most of the basic Polaris form field components out of the box and also handles custom fields, grouped fields, repeatable fields and a few other bells and whistles. Let’s dig in!

### Contents

-   [Installation](#installation)
-   [Example usage](#example-usage)
-   [Configuring a Form Builder](#configuring-a-form-builder)
-   [Defining Fields](#defining-fields)
-   [Error handling](#error-handling)
-   [Dynamic fields](#dynamic-fields)
-   [Custom fields](#custom-fields)
-   [Examples](#examples)

## Installation

You can install this package via NPM:

```
npm install @additionapps/polaris-form-builder
```

Note that this package requires that your application is using Shopify Polaris version `4.*` or higher.

## Example usage

Using the form builder is a three step process.

First, configure the form that you wish to display. This is a simple javascript array containing field objects:

```js
// In MyForm.js
export const fields = [
	{
		key: "title",
		input: "text",
		config: {
			name: "title",
			label: "Product title",
			placeholder: "Product title",
		},
	},
	{
		key: "description",
		input: "text",
		config: {
			name: "description",
			label: "Product description",
			placeholder: "Product description",
		},
	},
];
```

Next we’ll define our model - the data that we want the form to interact with - along with a method to set this data. We’ll use a React functional component as an example:

```jsx
// In MyComponent.jsx
export const MyComponent = () {
    const [model, setModel] = useState({
        title: null,
        description: null,
    });

    return (
        //...
    );
}

```

Now, all that’s left to do is to configure our Form Builder:

```jsx
import { fields } from './MyForm';
import { PolarisFormBuilder} from '@additionapps/polaris-form-builder;

export const MyComponent = () {
    const [model, setModel] = useState({
        title: null,
        description: null,
    });

    return (
        <PolarisFormBuilder
            model={model}
            fields={fields}
            onModelUpdate={setModel}
        ></PolarisFormBuilder>
    );
}
```

That’s it! The form builder will take care of displaying your form fields and will update your model when the values in the fields change. You can see this simple example in action here:

[Polaris Form Builder - simple demo](https://codesandbox.io/s/simple-demo-fx8nq?file=/SimpleDemoForm.jsx)

A more advanced ‘kitchen sink’ demo showing all built-in field types, a custom field and dynamic fields can be seen here:

[Polaris Form Builder - kitchen sink demo](https://codesandbox.io/s/kitchen-sink-demo-ts4j6?file=/KitchenSinkDemoForm.jsx)

---

## Configuring a Form Builder

There are more options available when configuring a form builder than are shown in the simple example above. Here are the available props:

#### `fields`

_Required_. An array containing configuration objects for each field you want to display on your form. See [Defining Fields](#defining-fields).

#### `model`

_Required_. An object that encapsulates the data that the form will interact with. Each key on this object should correspond to the `key` property for a field in your form field config array.

#### `onModelUpdate`

_Required_. A function that accepts as its only parameter the updated model when the input in any of the form’s fields changes.

#### `units`

_Optional_. An object containing configuration relating to the units that should be used in certain form fields. The keys in this object are all optional and include:

-   `locale`: The string representing the desired language as defined in [BCP 47](https://tools.ietf.org/rfc/bcp/bcp47.txt) . If not supplied, the `locale` will be automatically derived via `navigator.language`.
-   `currency`: The three-letter currency code as defined by [ISO 4217](https://www.iso.org/iso-4217-currency-codes.html#:~:text=The%20first%20two%20letters%20of,and%20the%20D%20for%20dollar.)]. If not supplied the currency will be derived automatically based on the `locale`.
-   `weight`: One of `g` (grams), `kg` (kilograms), `oz` (ounces) or `lb` (pounds).

#### `errors`

_Optional_. An object of validation error messages. The keys of this object are expected to be the dot notation paths of the field the error refers to and the values are the error messages themselves. Example:

```
const errors = {
  'title' : 'The title field is required',
  'things.0.summary' => 'A thing must have a summary'
}
```

#### `onErrorUpdate`

_Optional_. A function that accepts as its only parameter the updated errors object. When a field with an error receives new input, the error is removed from the supplied `errors` object. This callback function allows the consuming component to react to this change. For more information see [Error handling](#error-handling).

#### `focus`

_Optional_. A string describing a dot notation path to the field that should be focused. This is useful when [working with errors](#error-handling) or [dynamic form fields](#dynamic-fields)s.

#### `onFocusUpdate`

_Optional_. A function that accepts as its only parameter a string describing the dot notation path of the field that was most recently focused. This is useful when [working with errors](#error-handling) or [dynamic form fields](#dynamic-fields).

---

## Defining fields

The `fields` prop passed to the Form Builder is an array of objects, each one configuring a single field in your form.

All field objects should at minimum have the following three required properties:

`key` - a string that matches the property on the model you pass to the Form Builder

`input` - a string that corresponds to one of the built-in field types or a custom field type (see [Custom fields](#custom-fields)). The built in field types are:

-   `checkbox`
-   `choice`
-   `group`
-   `money`
-   `percentage`
-   `range`
-   `repeater`
-   `select`
-   `text`
-   `weight`

`config` - an object allowing you to configure the underlying Polaris field component per the Polaris documentation.

All fields also have some optional keys:

-   `warning` - accepts a string as a value. If this is present a yellow warning banner will display below the input with the string specified.
-   `defaultValue` - For use with subfields only. Accepts a string or number as a value.

Certain fields require additional options to be specified. The requirements for each field are as follows:

#### `checkbox`

This field corresponds to the [Shopify Polaris Checkbox](https://polaris.shopify.com/components/forms/checkbox) field.

Minimum configuration:

```js
{
  key: "my_checkbox_field",
  input: "checkbox",
  config: {
    // required by Polaris component
    label: "Do you agree?"
  }
}
```

The `config` object can include any of the props defined in the [Shopify Polaris Checkbox](https://polaris.shopify.com/components/forms/checkbox) documentation except `checked`, `error` and `onChange` as these are handled by the Form Builder.

#### `choice`

This field corresponds to the [Shopify Polaris Choice List](https://polaris.shopify.com/components/forms/choice-list) field.

Minimum configuration:

```js
{
  key: "my_checkbox_or_radio_list_field",
  input: "choice",
  config: {
    // required by Polaris component
    title: "Select some things",
    choices: [
      // { label: "Thing One", value: "one" },
      // { label: "Thing Two", value: "two" },
    ]
  }
}
```

The `config` object can include any of the props defined in the [Shopify Polaris Choice List](https://polaris.shopify.com/components/forms/checkbox) documentation except `selected`, `error` and `onChange` as these are handled by the Form Builder.

#### `group`

A `group` field is a container that enables the display of two or more sub fields side by side.

Minimum configuration:

```js
{
	// The key for a group field does not correspond
  // to a property in your data model.  Prefixed here
  // with an underscore to make this more apparent
  key: "_my_group_field",
  input: "group",
  layout: 'condensed',
  subFields: [
    // Child field configuration objects
  ]
}
```

The `layout` key determines if the `group` should use a condensed or regular [Shopify Polaris Form Layout](https://polaris.shopify.com/components/forms/form-layout#navigation). If this key is omitted a regular form layout group will be used. If the value is set to `condensed` a condensed form layout group will be used.

The `subFields` array can include configuration objects for any of the built in or custom field types.

#### `money`

This field allows for monetary values to be persisted in the lowest denomination (e.g. cents, pence etc) for the currency. Currency is specified by passing in a `units` object to the Form Builder - see Configuring a Form Builder.

The value will be displayed as a float or integer - as appropriate for the currency - when the field is focused and will display a formatted representation of the value based on the locale (again this is specified via the `units` prop on the Form Builder).

To illustrate, let’s assume a Form Builder instance is using GBP as currency and en-GB as a locale. If the user enters 10.45 into a money field, the value saved on the data model will be 1045 and on blur, the field will display `£10.45`.

Minimum configuration:

```js
{
  key: "my_money_field",
  input: "money",
  config: {
    // required by Polaris component
    label: "Price",
  }
}
```

The `config` object can include any of the props defined in the [Shopify Polaris Text Field](https://polaris.shopify.com/components/forms/text-field) documentation except `value`, `error`, `focused`, `onChange`, `onFocus` and `onBlur` as these are handled by the Form Builder.

#### `simple_money`

This field is a much more basic version of the `money` field. It is essentially a `text` field with a prefix displaying the currency specified in the `units` prop. No additional checks or formatting are performed on input - it is assumed that the backend of your application is responsible for validating and processing input and that the value passed to this field is in the correct format.

Minimum configuration:

```js
{
  key: "my_simple_money_field",
  input: "simple_money",
  config: {
    // required by Polaris component
    label: "How much is it worth?",
  }
}
```

The `config` object can include any of the props defined in the [Shopify Polaris Text Field](https://polaris.shopify.com/components/forms/text-field) documentation except `value`, `error`, `focused`, `onFocus` and `onChange` as these are handled by the Form Builder.

#### `percentage`

This field allows for percentage values to be persisted as a decimal. The value will be displayed as the more human-friendly percentage when focussed and will display a formatted version of the percentage based on the locale (This is specified via the `units` prop on the Form Builder - see Configuring a Form Builder).

To illustrate, let’s assume a Form Builder instance is using en-GB as a locale. If the user enters 25 into a percentage field, the value saved on the data model will be 0.25 and on blur, the field will display `25 %`.

Minimum configuration:

```js
{
  key: "my_percentage_field",
  input: "percentage",
  config: {
    // required by Polaris component
    label: "What percentage?",
  }
}
```

The `config` object can include any of the props defined in the [Shopify Polaris Text Field](https://polaris.shopify.com/components/forms/text-field) documentation except `value`, `error`, `focused`, `onChange`, `onFocus` and `onBlur` as these are handled by the Form Builder.

#### `range_slider`

This field corresponds to the [Shopify Polaris Range Slider](https://polaris.shopify.com/components/forms/range-slider) field.

Minimum configuration:

```js
{
  key: "my_slider_field",
  input: "range_slider",
  config: {
    // required by Polaris component
    label: "What value?"
  }
}
```

The `config` object can include any of the props defined in the [Shopify Polaris Range Slider](https://polaris.shopify.com/components/forms/range-slider) documentation except `value`, `error` and `onChange` as these are handled by the Form Builder.

#### `repeater`

A `repeater` field makes it possible to work with arrays of objects in model data. For example:

```js
const data: {
  my_repeater_field: [
    { title: 'Foo', description: 'Bar' },
    { title: 'Baz', description: 'Qux' },
  ]
}
```

A repeater field will offer the user controls for adding and deleting rows of data.

Minimum configuration:

```js
{
  key: "my_repeater_field",
  input: "repeater",
  emptyMessage: "No people added",
  addButtonText: "Add person",
  layout: 'stacked',
  title: 'My repeater field', //optional
  minRows: 1, //optional
  maxRows: 5, //optional
  subFields: [
    // Child field configuration objects
  ]
}
```

The `emptyMessage` property is required and will be displayed when the repeater field has no rows.

The `addButtonText` property determines the text that is displayed on the button used to add new rows. This property is optional - if missing the button will display ‘Add row’.

The `title` property will add a subheading above the repeater fields. This property is optional - if missing no title will be displayed.

The `minRows` and `maxRows` properties will ensure that the repeater cannot have less than or more than the number of items specified. The add/remove buttons will not be displayed once these limits are reached. These properties is optional and can be set independently.

The `layout` property determines how the child fields will be displayed. This can be one of three values: `stacked`, `grouped` or `condensed`. The choices correspond to the three different [Shopify Polaris Form Layout](https://polaris.shopify.com/components/forms/form-layout#navigation) options. This property is optional - if missing the layout will be `stacked`.

The `subFields ` array can include configuration objects for any of the built in or custom field types (including other repeater fields).

#### `select`

This field corresponds to the [Shopify Polaris Select Field](https://polaris.shopify.com/components/forms/select) field.

Minimum configuration:

```js
{
  key: "my_select_field",
  input: "select",
  config: {
    // required by Polaris component
    label: "Choose a thing",
    options: [
      // { label: "Thing One", value: "one" },
      // { label: "Thing Two", value: "two" },
    ]
  }
}
```

The `config` object can include any of the props defined in the [Shopify Polaris Select Field](https://polaris.shopify.com/components/forms/select) documentation except `value`, `error` and `onChange` as these are handled by the Form Builder.

#### `simple_money`

This field is a much more basic version of the `money` field. It is essentially a `text` field with a prefix displaying the currency specified in the `units` prop. No additional checks or formatting are performed on input - it is assumed that the backend of your application is responsible for validating and processing input and that the value passed to this field is in the correct format.

Minimum configuration:

```js
{
  key: "my_simple_money_field",
  input: "simple_money",
  config: {
    // required by Polaris component
    label: "How much is it worth?",
  }
}
```

The `config` object can include any of the props defined in the [Shopify Polaris Text Field](https://polaris.shopify.com/components/forms/text-field) documentation except `value`, `error`, `focused`, `onFocus` and `onChange` as these are handled by the Form Builder.

#### `simple_weight`

This field is a much more basic version of the `weight` field. It is essentially a `text` field with a suffix displaying the weight units specified in the `units` prop. No additional checks or formatting are performed on input - it is assumed that the backend of your application is responsible for validating and processing input and that the value passed to this field is in the correct format.

Minimum configuration:

```js
{
  key: "my_simple_weight_field",
  input: "simple_weight",
  config: {
    // required by Polaris component
    label: "How much does it weigh?",
  }
}
```

The `config` object can include any of the props defined in the [Shopify Polaris Text Field](https://polaris.shopify.com/components/forms/text-field) documentation except `value`, `error`, `focused`, `onFocus` and `onChange` as these are handled by the Form Builder.

#### `text`

This field corresponds to the [Shopify Polaris Text Field](https://polaris.shopify.com/components/forms/text-field) field.

Minimum configuration:

```js
{
  key: "my_text_field",
  input: "text",
  config: {
    // required by Polaris component
    label: "Choose a thing",
  }
}
```

The `config` object can include any of the props defined in the [Shopify Polaris Text Field](https://polaris.shopify.com/components/forms/text-field) documentation except `value`, `error`, `focused`, `onFocus` and `onChange` as these are handled by the Form Builder.

#### `weight`

This field allows for weight values to be persisted in grams whilst letting the user enter values based on the provided weight unit (this is specified via the `units` prop on the Form Builder - see Configuring a form builder).

To illustrate, let’s assume a Form Builder instance is using kg as the weight unit. If the user enters 5 into a weight field, the value saved on the data model will be 5000.

Minimum configuration:

```js
{
  key: "my_weight_field",
  input: "weight",
  config: {
    // required by Polaris component
    label: "What weight?",
  }
}
```

The `config` object can include any of the props defined in the [Shopify Polaris Text Field](https://polaris.shopify.com/components/forms/text-field) documentation except `value`, `error`, `focused`, `onChange`, `onFocus` and `onBlur` as these are handled by the Form Builder.

#### Note for TypeScript users

The built-in fields extend from the Polaris field interfaces. As as result you should ensure that you supply _all_ required props for the underlying Polaris field in your `config` object.

In practice that will often mean supplying a `value` (or in the case of choice-like fields you will need to specify a `selected` property) for your field. Generally you can just set this to null - the Form Builder will overwrite this when generating the field. Example:

```tsx
import Field from '@additionapps/polaris-form-builder;

const fields: Field[] = [
  {
    key: "my_text_field",
    input: "text",
    config: {
      // Both label and value are required
		// by Polaris component
      label: "Choose a thing",
      value: null
    }
  }
]
```

---

## Error handling

The Form Builder can take care of displaying form validation errors that are passed to the `PolarisFormBuilder` component via the `errors` prop.

Typically there are two approaches to form validation:

-   Validation on form submission - the server sends back a set of validation errors for the form which are then displayed to the user
-   Validation on input - the data model is checked as it is updated to ensure that it matches a set of validation requirements that are defined in JavaScript.

Let’s look at how the Form Builder handles these approaches:

#### Validation on form submission

On form submission, your application will typically make an [XMLHttpRequest](https://developer.mozilla.org/en-US/docs/Web/API/XMLHttpRequest) and receive a response back from the server. If there are validation errors these will be sent back as an object which can then be passed into the Form Builder instance.

The Form Builder expects the error object to have keys that correspond to the key on your data model that has an invalid value. These keys should use dot notation to target model keys are are nested within arrays e.g.:

```js
const errors = {
  'title' : 'The title field is required',
  'things.0.summary' => 'A thing must have a summary'
}
```

When a field that is is displaying an error receives new input, the Form Builder instance will remove that item from the errors object. In order to keep the state of the parent component in sync with the Form Builder, an `onErrorUpdate` callback function can be supplied to the Form Builder. This method will receive the updated errors object from the Form Builder which can then be applied to the parent component state.

The form builder also accepts a `focus` prop and an `onFocusUpdate` callback method. This callback method helps to ensure that field focus is not lost in text (or text-like) fields when errors update and the form builder re-renders. Here is an example:

[Polaris Form Builder - validation on submit demo](https://codesandbox.io/s/polaris-form-builder-validation-on-submit-yn1y3?file=/ValidationOnSubmitForm.jsx)

Note - for simple forms that only use validation on form submission and do not accept dynamic fields or dynamic units, managing errors and focus using these event callbacks is not necessary - the Form Builder will track changes to the errors internally.

#### Validation on input

As a convenience for your users you may want to provide validation feedback as they interact with your form. The Form Builder can be integrated with object validators such as the popular [Yup](https://github.com/jquense/yup) library.

Here is a simple example using this library that demonstrates on-input validation:

[Polaris Form Builder - validation on input demo](https://codesandbox.io/s/polaris-form-builder-validation-on-input-demo-05p2c?file=/ValidationOnInputForm.jsx)

## Dynamic fields

A common requirement in forms is for fields to present the user with different options or fields based on their input. For example if a user selects “United States” in a `country` field they should see a list of US states in a `states` field. If they then select another `country` they should see a different set of `states`.

Because fields are defined as a JavaScript array you can manipulate it however you need to before passing it into the Form Builder. Typically, this will involve taking one or more values from your model and the mapping over the fields in your form config to manipulate them as required based on those values.

To make this process a little easier, you can use the `transformFields` utility method which accepts the array of field config options as it’s first argument and a callback that defines how each field in the array should be manipulated.

If the Form Builder detects a change in the fields it has been passed it will re-render.

Here is an example:

[Polaris Form Builder - dynamic fields demo](https://codesandbox.io/s/polaris-form-builder-dynamic-fields-demo-hvzc6?file=/DynamicFieldsForm.jsx)

## Custom fields

Whilst the built-in field types will cover the majority of use-cases, there may be occasions where a custom field type is required.

The Form Builder accepts an optional `customFields` prop. This prop should be passed an array of functional React components, each one of which is a custom field type.

You can see an example of a Form Builder using a custom field type here:

[Polaris Form Builder - custom fields demo](https://codesandbox.io/s/polaris-form-builder-custom-fields-demo-91dsw?file=/CustomFieldsDemoForm)

A few notes on creating custom fields:

#### Naming

The name of the React functional component should be pascal case and be suffixed with the word `Field`. The snake case form of this name (without the field suffix) will be used when defining the field in your form config. For example if your custom field component is `CustomColourField` you should refer to this field type in your form config as `input: 'custom_colour'`.

#### Props

Your field should accept four props - `field`, `state`, `actions` and `ancestors`:

-   `field` - the configuration object for the field, as defined in your form config.
-   `state` - an object representing the current internal state of the Form Builder instance. There are several properties on this object:
    -   `model` - the current state of the model, passed into the Form Builder.
    -   `fields` - the full form config object.
    -   `errors` - the current state of any errors passed into the Form Builder.
    -   `focus` - a dot notation path for the most recently focused field.
    -   `inputs` - an array of input types currently registered on the current Form Builder instance. This will include all the built-in field types and any custom fields passed into the form builder.
    -   `units` - an object with information about the units that should be used to display certain field values.
-   `actions` - an object holding a number of methods used to manage the state of the form builder. Relevant methods:
    -   `updateField(value, field, ancestors)` - used to update the model with the new value. This method is typically invoked when the field receives input.
    -   `setFocus(field, ancestors)` - used to keep track of the most recently focused form field. This is typically used for text-like fields and in usually invoked on field focus.
-   `ancestors` - an array of ‘field parent’ objects that helps to determine the position of a field within the model. This value typically won’t be interacted with directly but will be passed to `actions` like `updateField` and `setFocus`

## Examples

This readme contains a number of live examples which are listed again below for convenience:

-   [Simple demo](https://codesandbox.io/s/simple-demo-fx8nq?file=/SimpleDemoForm.jsx)
-   [Kitchen sink demo](https://codesandbox.io/s/kitchen-sink-demo-ts4j6?file=/KitchenSinkDemoForm.jsx)
-   [Validation on form submit](https://codesandbox.io/s/polaris-form-builder-validation-on-submit-yn1y3?file=/ValidationOnSubmitForm.jsx)
-   [Validation on input](https://codesandbox.io/s/polaris-form-builder-validation-on-input-demo-05p2c?file=/ValidationOnInputForm.jsx)
-   [Dynamic form fields](https://codesandbox.io/s/polaris-form-builder-dynamic-fields-demo-hvzc6?file=/DynamicFieldsForm.jsx)
-   [Custom fields](https://codesandbox.io/s/polaris-form-builder-custom-fields-demo-91dsw?file=/CustomFieldsDemoForm)

---

### Changelog

Please see [CHANGELOG](https://github.com/AdditionApps/polaris-form-builder/blob/master/CHANGELOG.md) for more information on what has changed recently.

### Contributing

Please see [CONTRIBUTING](https://github.com/AdditionApps/polaris-form-builder/blob/master/CONTRIBUTING.md) for details.

### Security

If you discover any security related issues, please email [john@addition.com.au](mailto:john@addition.com.au) instead of using the issue tracker.

### Treeware

You’re free to use this package, but if it makes it to your production environment we would highly appreciate you buying or planting the world a tree.

It’s now common knowledge that one of the best tools to tackle the climate crisis and keep our temperatures from rising above 1.5C is to plant trees. If you contribute to my forest you’ll be creating employment for local families and restoring wildlife habitats.

You can buy trees at [Offset Earth](https://offset.earth/treeware)

Read more about Treeware at [Treeware](https://treeware.earth/)

### Credits

John Wyles
All Contributors

### License

The MIT License (MIT). Please see [License File](https://github.com/AdditionApps/polaris-form-builder/blob/master/LICENSE.md) File for more information.
