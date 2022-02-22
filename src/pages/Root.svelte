<script>
  import { Column, Grid, Row, Link, ListItem, UnorderedList, OrderedList } from "carbon-components-svelte";
  import Folder24 from "carbon-icons-svelte/lib/Folder24";
  import Chat24 from "carbon-icons-svelte/lib/Chat24";
  import Document24 from "carbon-icons-svelte/lib/Document24";
  import CautionInvertedGlyph from "carbon-icons-svelte/lib/CautionInvertedGlyph";
</script>

<div id="top">
  <div class="header">
    <div id="logo">
      <img width="200px" src="https://avatars.githubusercontent.com/u/99763872?s=500&v=4" alt="DeFi Logo">
    </div>
    <Grid id="titleGrid" style="margin: 12px auto;text-align: center;">
      <Row padding="30px">
        <Column>
          <Link href="https://github.com/VoFarm/trading-actor-interface">
            <div>
              <Folder24/>
              <h4>Source Code</h4>
            </div>
          </Link>
        </Column>
      </Row>
      <Row padding="30px">
        <Column>
          <Link href="https://github.com/distributed-ledger-technology">
            <div>
              <Document24/>
              <h4>VoFarm Smart Contract</h4>
            </div>
          </Link>
        </Column>
      </Row>
      <Row padding="30px">
        <Column>
          <Link href="https://github.com/distributed-ledger-technology">
            <div>
              <Chat24/>
              <h4>Community</h4>
            </div>
          </Link>
        </Column>
      </Row>
    </Grid>

  </div>
  <div class="header">
    <Grid id="titleGrid" style="margin: 12px auto;width:350px;text-align: unset;">
      <Row padding="30px">
        <Column>
          <h4>
            A <span class="highlight">Peer 2 Peer</span> approach to <span class="highlight">increase price stability</span> and to
            <span class="highlight">reduce price manipulation</span> by exploiting non-fundamentals-based volatility while leveraging and
            optimizing
            <span class="highlight">Uniswap V3</span>.

          </h4>
        </Column>
      </Row>
    </Grid>
  </div>
</div>

<div class="header" id="mid">
  <h4>
    <span class="highlight">Volatility Farming</span> shall empower the algo- trading community to benefit from non-fundamentals-based
    volatility and from trading volume itself (earning LP Fees) at the same time.
  </h4>
</div>
<h4 id="info">
  Get More Information
  <CautionInvertedGlyph/>
</h4>

<div id="bottom">
  <div>
    <h2 class="bottomtitles">
      <i>
      <span class="highlight">
      "The CeFi system is not as fair as it should be and the DeFi system is not as efficient as it could be"
        </span>
      </i>
    </h2>
    <div class="section">
      <div style="width: 75%">
        <img style="padding:0 50px" width="100%"
             src="https://user-images.githubusercontent.com/43786652/139266203-69b676da-f8ed-43f8-a139-79593b64562d.png"
             alt="CeFi vs DeFi">
      </div>
      <UnorderedList>
        <p class="listInfo">
          A high percentage of the average volatility is induced by manipulation - not fundamentals
        </p>
        <p class="listInfo">
          Manual and individual trading does not add much value to society, nature, culture and the well-being of individuals
        </p>
        <p class="listInfo">
          So called "retail traders" loose money to those who have the power to manipulate markets in classical trading
          infrastructures
        </p>
        <p class="listInfo">
          Introducing "flexible concentrated capital" is economically more reasonable now due to layer 2 scaling solutions like
          Arbitrum
        </p>
        <p class="listInfo">
          Volatility Farming at scale has the potential to increase price stability by exploiting non-fundamentals based volatility
        </p>
        <p class="listInfo">
          VoFarm Pools bring the algo- trading community (currently using hummingbot, coinrule, ...) to a new level
        </p>
        <p class="listInfo">
          It is a good idea to increase freedom for individuals as more than 51 % of individuals are fair and reasonable people
        </p>
      </UnorderedList>
    </div>
  </div>

  <h2 class="bottomtitles">
    <span class="highlight">
      <i>
        "How does the Volatility Farm Work?"
      </i>
    </span>
  </h2>
  <div class="section">
    <UnorderedList>
      <p class="listInfo">
      </p>
      <p class="listInfo">
        Each specific VoFarm Pool Smart Contract inherits from the VFPool template "is VFPool" ....
        The only function which shall be implemented specifically is getCurrentInvestmentAdvice().
      </p>
      <p class="listInfo">
        An investment advice can e.g. recommend to:
      </p>
      <p class="listInfo">
        <span class="highlight">
          Execute a Single Swap
        </span>
      </p>
      <p class="listInfo">
        <span class="highlight">
          Increase or Decrease Liquidity
        </span>
      </p>
      <p class="listInfo">
        <span class="highlight">
          Hedge against price change risk as Liquidity Provider - for volatile assets e.g. in 0.3 % fee tier
        </span>
      </p>
    </UnorderedList>
    <div style="width: 80%">
      <img style="padding:0 50px" width="100%"
           src="https://user-images.githubusercontent.com/43786652/139266230-d3123e62-098c-466b-8712-915985f8961d.png"
           alt="VolatilityFarm">
    </div>
  </div>

  <h2 class="bottomtitles">
    <span class="highlight">
      <i>
        Example of ETH Price Prediction Based Strategies
      </i>
    </span>
  </h2>
  <div class="section">
    <UnorderedList>
      <p class="listInfo">
        The following example implementation optimizes capital efficiencies around ETH/DAI by basically applying the following moves:
      </p>
      <OrderedList>
        <p class="listInfo">
          1. If ETH price is about to trade sideways --> be an all in 50/50 ETH/DAI Liquidity Provider
        </p>
        <p class="listInfo">
          2. If ETH price is about to rise quickly and significantly --> be an ETH Holder (helping users to avoid "impermanent loss")
        </p>
        <p class="listInfo">
          3. If ETH price is about to drop quickly and significantly --> be a DAI Holder (preparing to buy back into the game at the right
          time)
        </p>
      </OrderedList>
    </UnorderedList>
  </div>


  <h2 class="bottomtitles">
    <span class="highlight">
      <i>
        Hedge Based Strategies
      </i>
    </span>
  </h2>
  <div class="section">
    <UnorderedList>
      <p class="listInfo">
        The risk of price changes (aka risk for "impernanent loss" (which might be better called "opportunity cost")) is something which
        currently prevents many liquidity providers from "going all in" to their specific range. An unopinionated hedge mechanism can
        neutralize this risk. Its assumption is that it does not know if prices go up or down but that prices go up AND down frequently -
        compare basic Roulette Martingale Strategy.
      </p>
    </UnorderedList>
  </div>


  <h2 class="bottomtitles">
    <span class="highlight">
      <i>
        Details
      </i>
    </span>
  </h2>
  <div class="section">
    <UnorderedList>
      <p class="listInfo">
        People can invest an arbitrary amount of Ether to the pool / strategy of their choice and receive a reward depending on the success
        of the pool which they have chosen proportional to the amount of Ether which they have invested.

        The wallet which deployed the smart contract defining the specific vf pool + strategy, earns a percentage (defined in the smart
        contract) of the pool's gains to reward the developer who deployed the corresponding smart contract. This also incentivices
        developers to come up with better and better strategies etc.

        To keep things safe and simple the strategy of a specific pool can never be changed. To bet on a different strategy one can move
        one's capital from one pool to another - ... thanks to layer 2 scaling (e.g. via Arbitrum).
      </p>
    </UnorderedList>
  </div>
</div>

<style>
    .highlight {
        color: #0f62fec4;
    }

    .header {
        max-width: 600px;
        display: flex;
        margin: 0 12px;
        flex-direction: row;
        align-items: center;
        box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.08);
        background-color: white;
    }

    .listInfo {
        margin: 28px 4px;
        font-size: 20px;
    }

    .section {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-around;
        background: #f3f8ff;
        padding: 25px;
        box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.08);
    }

    #logo {
        margin: 12px 0 0 44px;
    }

    #mid {
        max-width: unset;
        margin: 0 auto;
        width: 900px;
        padding: 25px 30px;
    }

    #top {
        display: flex;
        flex-direction: row;
        align-content: center;
        justify-content: center;
        margin: 110px 0 20px;
    }

    #bottom {
        max-width: unset;
        margin: 35vh auto 0;
        width: 90vw;
        padding: 25px 30px;
    }

    .bottomtitles {
        margin: 36px auto;
        margin-top: 128px;
        text-align: center;
    }

    #info {
        margin: 48px auto;
        text-align: center;
        color: #646464;
    }

</style>
