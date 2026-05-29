import app from 'flarum/forum/app';
import { extend } from 'flarum/common/extend';
import 'autolink-js';
import UserCard from 'flarum/forum/components/UserCard';
import User from 'flarum/common/models/User';
import Model from 'flarum/common/Model';
import UserBio from './components/UserBio';

app.initializers.add('dgc-user-students', () => {
  User.prototype.bio = Model.attribute('bio');

  extend(UserCard.prototype, 'infoItems', function (items) {
    let user = this.attrs.user;

    if (!user.attribute('canViewBio')) {
      return;
    }

    items.add('bio', <UserBio user={user} editable={this.attrs.editable} />, -100);
  });
});
