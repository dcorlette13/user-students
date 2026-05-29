import app from 'flarum/admin/app';

app.initializers.add('dgc-user-students', () => {
  app.extensionData
    .for('dgc-user-students')
    .registerPermission(
      {
        icon: 'fas fa-pen',
        label: app.translator.trans('dgc-user-students.admin.permission.view'),
        permission: 'dgc-user-students.view',
        allowGuest: true,
      },
      'view'
    )
    .registerPermission(
      {
        icon: 'fas fa-pen',
        label: app.translator.trans('dgc-user-students.admin.permission.editOwn'),
        permission: 'dgc-user-students.editOwn',
      },
      'start'
    )
    .registerPermission(
      {
        icon: 'fas fa-pen',
        label: app.translator.trans('dgc-user-students.admin.permission.editAny'),
        permission: 'dgc-user-students.editAny',
      },
      'moderate'
    );
});
