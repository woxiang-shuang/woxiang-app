import * as React from 'react';
import Svg, { Image } from 'react-native-svg';

function Star(props) {
  return (
    <Svg width={35} height={35} viewBox="0 0 35 35" {...props}>
      <Image
        data-name="star"
        width={35}
        height={35}
        xlinkHref="data:img/png;base64,iVBORw0KGgoAAAANSUhEUgAAACMAAAAjCAYAAAAe2bNZAAAC3klEQVRYhcWXTU8TQRjH//+RgvRCNOqBhGhDoeKaeNN4MAp+hoIGD3jxqCYS0TMYo/HCNyBeFPYzGDWe9OZhkZISBKNBIhJiRGzLPmamWCm0+9YVJtm0OzPPb3777MvMoNEiTv8DcbIr+rdRFhsJFid7VgRvKzDiHC37XVSeakQGwD2f81AlcmZkdqAHRdcR+ccgIUgoi92TH6Iwo2emJCPbRYygPi/JSFRkpMxI/koHNtw5gSR2A1kEJU3LXgzLjZaZ3+5wLREjaup5Jwo2dGYkd/UIiqUFAZIe0HUkmo4z8+xbGHb4zGxu3vQSgckOkrpfWHSozMhctg2/OC+QQ/5grqJVUuy012KTEckeQF6dQMG1AAyL4EJgOPEGwBM0Kwdp9yNpbwaSESd7GAoZuMgAVUdaBM1BBTzECgDyAHKVQyEHFzla9nfTR5yBQUAei0h7owNGF+UXgHcpTnZZBEf3S6QiBCzrt2lmv0VMIWa1zDUSC/vqUR5/0DzAMpNNocTXAunYcxHwE5rkIk/a8+ajp/+ghb0kPu+piH5wKX1m/O1fYHZNzkGpPhJLeyOCJSj20rLzlbqdncw6peC+EuDYfxMBltGsLu1c9+yam0wHpS6TDDXJBRbRXM2vsQCrOx1IbuAMivIyyDwUWETPVwn2MjP5vlZ73VnbBFDG4hIpQ2WsnoinzFbz11hlfHjeMpRMrC4+PG8ZF6dilfHh+a304pXx4dWVEbmRAKQrZpl0mRtSBtM/ugVoitPE7BymV+teoMdtcuO+RX9LXa6HjPjKkFgkOETV0k7iuj5vRMbrNtQNIrEG4UMkk+NMTWxsVU/I/NBz/ly/Bcp9EbSF5Xq9TbuC9NaVxDhUaydPTz3aJlJuT01s6HrTToybrW48MnKwaiDSRgt7aNm32fN0xeMioNt1P9Nfx1WXKm4wGapRPdWTeEGlztOa6jdrnhBF9zdxOl5z9NKBGK2JAPAHOy35mQVHnd0AAAAASUVORK5CYII="
      />
    </Svg>
  );
}

export default Star;