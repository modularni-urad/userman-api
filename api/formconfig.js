export default {
  attrs: [
    {
      name: 'username',
      component: 'dyn-input',
      fieldcomponent: true,
      label: 'Uživatelské jméno',
      rules: 'required'
    },
    {
      name: 'name',
      component: 'dyn-input',
      fieldcomponent: true,
      label: 'Jméno',
      rules: 'required'
    },
    {
      name: 'email',
      component: 'dyn-input',
      fieldcomponent: true,
      label: 'Email'
    },
    {
      name: 'status',
      component: 'dyn-select',
      options: [
        { value: 0, text: 'OK' },
        { value: 2, text: 'Zablokován' }
      ],
      fieldcomponent: true,
      label: 'Status'
    },
    {
      name: 'created',
      fieldcomponent: true
    }
  ]
}