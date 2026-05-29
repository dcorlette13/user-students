import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Button from 'flarum/common/components/Button';
import classList from 'flarum/common/utils/classList';

/**
 * Returns an array of year strings starting from the current year,
 * up to 8 years into the future (9 entries total).
 */
function getYearOptions() {
  const currentYear = new Date().getFullYear();
  const years = [];
  for (let i = 0; i <= 8; i++) {
    years.push(String(currentYear + i));
  }
  return years;
}

/**
 * Parses a comma-separated bio string into a Set of year strings.
 */
function parseYears(bio) {
  return new Set(
    (bio || '').split(',').map((y) => y.trim()).filter((y) => y.length > 0)
  );
}

// Stable no-op function — reusing the same reference avoids Mithril
// seeing a changed event handler on every redraw
function noop() {}

/**
 * The `UserBio` component displays a user's graduation years, optionally
 * letting the user edit them via checkboxes.
 */
export default class UserBio extends Component {
  oninit(vnode) {
    super.oninit(vnode);

    this.editing = false;
    this.loading = false;

    // Holds the in-progress checkbox selections while editing
    this.selectedYears = new Set();
  }

  view() {
    const user = this.attrs.user;

    if (!user) return <div className="UserBio" />;

    const editable = !!this.attrs.editable && !!user.attribute('canEditBio');
    const years = getYearOptions();
    let content;

    if (this.editing) {
      content = (
        <form onsubmit={this.save.bind(this)}>
          <div className="UserBio-checkboxes">
            {years.map((year) => (
              <label className="UserBio-checkbox-label">
                <input
                  type="checkbox"
                  value={year}
                  checked={this.selectedYears.has(year)}
                  onchange={this.onCheckboxChange.bind(this)}
                />
                {' '}{year}
              </label>
            ))}
          </div>
          <div className="UserBio-actions">
            <Button className="Button Button--primary" type="submit">
              {app.translator.trans('dgc-user-students.forum.profile.save_button')}
            </Button>
            <Button className="Button" type="reset" onclick={this.reset.bind(this)}>
              {app.translator.trans('dgc-user-students.forum.profile.cancel_button')}
            </Button>
          </div>
        </form>
      );
    } else {
      let subContent;

      if (this.loading) {
        subContent = (
          <p className="UserBio-placeholder">
            <LoadingIndicator />
          </p>
        );
      } else {
        const selectedYears = [...parseYears(user.bio())];

        if (selectedYears.length > 0) {
          subContent = (
            <ul className="UserBio-year-list">
              {selectedYears.map((year) => <li>{year}</li>)}
            </ul>
          );
        } else if (editable) {
          subContent = (
            <p className="UserBio-placeholder">
              {app.translator.trans('dgc-user-students.forum.userbioPlaceholder')}
            </p>
          );
        }
      }

      content = (
        <div
          className="UserBio-content"
          onclick={editable ? this.edit.bind(this) : noop}
          onkeydown={editable ? this.onkeydown.bind(this) : noop}
          role={editable ? 'button' : undefined}
          tabindex={editable ? '0' : undefined}
          aria-label={editable ? app.translator.trans('dgc-user-students.forum.profile.edit_bio_label') : undefined}
        >
          {subContent}
        </div>
      );
    }

    return (
      <div
        className={
          'UserBio ' +
          classList({
            editable,
            editing: this.editing,
          })
        }
      >
        {content}
      </div>
    );
  }

  onCheckboxChange(e) {
    const year = e.target.value;
    if (e.target.checked) {
      this.selectedYears.add(year);
    } else {
      this.selectedYears.delete(year);
    }
    m.redraw();
  }

  onkeydown(e) {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      this.edit(e);
    }
  }

  edit(e) {
    if (e.ctrlKey || e.metaKey) return;
    e.preventDefault();

    // Only retain saved years that fall within the current valid range
    const validYears = new Set(getYearOptions());
    this.selectedYears = new Set(
      [...parseYears(this.attrs.user.bio())].filter((y) => validYears.has(y))
    );

    this.editing = true;
    m.redraw();
  }

  save(e) {
    e.preventDefault();

    const user = this.attrs.user;
    // Sort numerically before saving for a consistent storage order
    const value = [...this.selectedYears]
      .sort((a, b) => Number(a) - Number(b))
      .join(',');

    if (user.bio() !== value) {
      this.loading = true;

      user
        .save({ bio: value })
        .catch(() => {
          this.editing = true;
          m.redraw();
        })
        .then(() => {
          this.loading = false;
          m.redraw();
        });
    }

    this.editing = false;
    m.redraw();
  }

  reset(e) {
    e.preventDefault();
    this.editing = false;
    // Restore selections to saved state, filtered to valid range
    const validYears = new Set(getYearOptions());
    this.selectedYears = new Set(
      [...parseYears(this.attrs.user.bio())].filter((y) => validYears.has(y))
    );
    m.redraw();
  }
}
