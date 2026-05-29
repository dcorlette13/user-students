import app from 'flarum/forum/app';
import Component from 'flarum/common/Component';
import LoadingIndicator from 'flarum/common/components/LoadingIndicator';
import Button from 'flarum/common/components/Button';
import classList from 'flarum/common/utils/classList';
import extractText from 'flarum/common/utils/extractText';

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
 * Parses a comma-separated bio string into a sorted array of year strings.
 */
function parseYears(bio) {
  return (bio || '').split(',').map((y) => y.trim()).filter((y) => y.length > 0);
}

/**
 * Converts the selectedYears Set to a sorted comma-separated string for storage.
 */
function yearsToString(selectedYears) {
  return Array.from(selectedYears).sort((a, b) => Number(a) - Number(b)).join(',');
}

/**
 * The `UserBio` component displays a user's graduation years, optionally
 * letting the user edit them via checkboxes.
 */
export default class UserBio extends Component {
  oninit(vnode) {
    super.oninit(vnode);
    this.editing = false;
    this.loading = false;
    this.selectedYears = new Set();
    this.textareaRows = '5';
    this.bioMaxLength = app.forum.attribute('dgc-user-students.maxLength');
    this.bioPlaceholder =
      app.session && app.session.user && app.session.user.id() === this.attrs.user.id()
        ? app.translator.trans('dgc-user-students.forum.userbioPlaceholder')
        : app.translator.trans('dgc-user-students.forum.userbioPlaceholderOtherUser', {
            username: this.attrs.user.displayName(),
          });
  }

  view() {
    const user = this.attrs.user;
    const editable = this.attrs.editable && this.attrs.user.attribute('canEditBio');
    const years = getYearOptions();
    let content;

    if (this.editing) {
      const selectedYears = this.selectedYears;

      content = (
        <form onsubmit={this.save.bind(this)}>
          <div className="UserBio-checkboxes">
            {years.map((year) => (
              <label className="UserBio-checkbox-label">
                <input
                  type="checkbox"
                  value={year}
                  checked={selectedYears.has(year)}
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
      // Non-editing view: display saved years as plain text.
      // Clicking switches to the checkbox editor.
      let subContent;

      if (this.loading) {
        subContent = (
          <p className="UserBio-placeholder">
            <LoadingIndicator />
          </p>
        );
      } else {
        const bio = user.bio();
        if (bio) {
          subContent = m.trust('<p>' + $('<div/>').text(bio).html() + '</p>');
        } else if (editable) {
          subContent = <p className="UserBio-placeholder">{this.bioPlaceholder}</p>;
        }
      }

      const maxLines = app.forum.attribute('dgc-user-students.maxLines') || 5;

      content = (
        <div
          className="UserBio-content"
          onclick={editable ? this.edit.bind(this) : () => undefined}
          onkeydown={editable ? this.onkeydown.bind(this) : () => undefined}
          style={{ '--bio-max-lines': maxLines }}
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

    const selection = window.getSelection();
    const lineIndex = selection.anchorOffset;
    const clickedNode = !selection.anchorNode || !e.target.className.includes('UserBio') ? e.target : selection.anchorNode;
    const lengthBefore = this.countTextLengthBefore(clickedNode);
    const currentScroll = e.currentTarget.scrollTop;
    const index = lengthBefore + lineIndex;

    // Initialise checkboxes from saved bio, filtering to valid year range
    const validYears = new Set(getYearOptions());
    this.selectedYears = new Set(
      parseYears(this.attrs.user.bio()).filter((y) => validYears.has(y))
    );

    this.textareaRows = getComputedStyle(e.currentTarget).getPropertyValue('--bio-max-lines') || '5';
    this.editing = true;
    m.redraw.sync();
  }

  save(e) {
    e.preventDefault();

    const user = this.attrs.user;
    const value = yearsToString(this.selectedYears);

    if (this.isDirty(value)) {
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

    if (!this.isDirty(yearsToString(this.selectedYears)) ||
        confirm(extractText(app.translator.trans('dgc-user-students.forum.profile.cancel_confirm')))) {
      this.editing = false;
      const validYears = new Set(getYearOptions());
      this.selectedYears = new Set(
        parseYears(this.attrs.user.bio()).filter((y) => validYears.has(y))
      );
      m.redraw();
    }
  }

  isDirty(value) {
    return this.attrs.user.bio() !== value;
  }

  countTextLengthBefore(anchorNode) {
    if (!anchorNode || (anchorNode instanceof HTMLElement && anchorNode.className.includes('UserBio'))) return 0;

    let length = 0;

    if (anchorNode.previousSibling) {
      for (let prev = anchorNode.previousSibling; prev; prev = prev.previousSibling) {
        length += prev.textContent.length;
      }
    }

    return length + this.countTextLengthBefore(anchorNode.parentNode);
  }
}
