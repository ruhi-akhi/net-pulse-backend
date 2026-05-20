const getNetworkQuality = ({ downloadSpeed, ping }) => {
  if (downloadSpeed >= 50 && ping < 20) {
    return 'Excellent';
  }
  if (downloadSpeed >= 20 && downloadSpeed < 50 && ping < 100) {
    return 'Good';
  }
  if (downloadSpeed >= 10 || ping < 200) {
    return 'Average';
  }
  return 'Poor';
};

module.exports = { getNetworkQuality };
