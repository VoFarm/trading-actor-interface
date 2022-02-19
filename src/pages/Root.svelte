<script>
  import { Column, Grid, Row, Link } from "carbon-components-svelte";
  import Folder24 from "carbon-icons-svelte/lib/Folder24";
  import Chat24 from "carbon-icons-svelte/lib/Chat24";
  import Document24 from "carbon-icons-svelte/lib/Document24";
</script>

<div id="header">
  <div style="margin: 12px auto; margin-right: 0;">
    <img width="155px" src="https://avatars.githubusercontent.com/u/99763872?s=200&v=4" alt="DeFi Logo">
  </div>
  <Grid id="titleGrid" style="margin: 12px auto;">
    <Row padding="30px">
      <Column>
        <Link href="https://github.com/VoFarm">
          <div>
            <Folder24/>
            <p>Source Code</p>
          </div>
        </Link>
      </Column>
    </Row>
    <Row padding="30px">
      <Column>
        <Link href="https://github.com/distributed-ledger-technology">
          <div>
            <Document24/>
            <p>VoFarm Smart Contract</p>
          </div>
        </Link>
      </Column>
    </Row>
    <Row padding="30px">
      <Column>
        <Link href="https://github.com/distributed-ledger-technology">
          <div>
            <Chat24/>
            <p>Community</p>
          </div>
        </Link>
      </Column>
    </Row>
  </Grid>
</div>

<style>
    #header {
        width: 40%;
        margin: 36px auto;
        display: flex;
        flex-direction: row;
        align-items: center;
        box-shadow: 0 12px 24px 0 rgba(0, 0, 0, 0.10);
    }
</style>
