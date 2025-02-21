import PropTypes from 'prop-types';
import { PureComponent } from 'react';

import { FormattedMessage } from 'react-intl';

import ImmutablePropTypes from 'react-immutable-proptypes';
import { connect } from 'react-redux';

import { debounce } from 'lodash';

import { fetchTrendingStatuses, expandTrendingStatuses } from 'mastodon/actions/trends';
import { DismissableBanner } from 'mastodon/components/dismissable_banner';
import StatusList from 'mastodon/components/status_list';
import { getStatusList } from 'mastodon/selectors';

const mapStateToProps = state => ({
  statusIds: getStatusList(state, 'trending'),
  isLoading: state.getIn(['status_lists', 'trending', 'isLoading'], true),
  hasMore: !!state.getIn(['status_lists', 'trending', 'next']),
});

class Statuses extends PureComponent {

  static propTypes = {
    statusIds: ImmutablePropTypes.list,
    isLoading: PropTypes.bool,
    hasMore: PropTypes.bool,
    multiColumn: PropTypes.bool,
    dispatch: PropTypes.func.isRequired,
  };

  componentDidMount () {
    const { dispatch } = this.props;
    dispatch(fetchTrendingStatuses());
  }

  handleLoadMore = debounce(() => {
    const { dispatch } = this.props;
    dispatch(expandTrendingStatuses());
  }, 300, { leading: true });

  render () {
    const { isLoading, hasMore, statusIds, multiColumn } = this.props;

    const emptyMessage = <FormattedMessage id='empty_column.explore_statuses' defaultMessage='Nothing is trending right now. Check back later!' />;

    return (
      <>
        <DismissableBanner id='explore/statuses'>
          <FormattedMessage id='dismissable_banner.explore_statuses' defaultMessage='These are posts from across the social web that are gaining traction today. Newer posts with more boosts and favourites are ranked higher.' />
        </DismissableBanner>

        <StatusList
          trackScroll
          statusIds={statusIds}
          scrollKey='explore-statuses'
          hasMore={hasMore}
          isLoading={isLoading}
          onLoadMore={this.handleLoadMore}
          emptyMessage={emptyMessage}
          bindToDocument={!multiColumn}
          withCounters
        />
      </>
    );
  }

}

export default connect(mapStateToProps)(Statuses);
