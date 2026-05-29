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
    )
    .registerSetting({
      label: app.translator.trans('dgc-user-students.admin.setting.bioLimit'),
      setting: 'dgc-user-students.maxLength',
      type: 'number',
      placeholder: 200,
    })
    .registerSetting({
      label: app.translator.trans('dgc-user-students.admin.setting.maxLines'),
      setting: 'dgc-user-students.maxLines',
      type: 'number',
      placeholder: 5,
      min: 5,
    })
    .registerSetting({
      label: app.translator.trans('dgc-user-students.admin.setting.allowFormatting'),
      help: app.translator.trans('dgc-user-students.admin.setting.allowFormatting_help'),
      setting: 'dgc-user-students.allowFormatting',
      type: 'boolean',
    });
});
