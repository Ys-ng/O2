var App = {
  web3Provider: null,
  contracts: {}
}
$(window).load(function () {
  //web3Provider 생성
  if (typeof web3 !== 'undefined') {
    App.web3Provider = web3.currentProvider;
    window.ethereum.enable();
    web3 = new Web3(web3.currentProvider);
  } else {
    App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
    web3 = new Web3(App.web3Provider);
  }

  //Election.json 파일 가져옴
  $.getJSON("Election.json", function (Election) {
    //Truffle 계약 초기화
    App.contracts.Election = TruffleContract(Election);
    //인스턴스 접속
    App.contracts.Election.setProvider(App.web3Provider);
    render();
  });

  //화면구현
  function render() {
    

    //계약 정보 읽기
    web3.eth.getCoinbase(function (err, account) {
        if (err === null) {
          App.account = account;
          $("#accountAddress").html("나의계정: " + App.account);
        }
      });

//candidate 정보 
    App.contracts.Election.deployed()
    .then(function (instance) {
        ElectionInstance = instance;
        return ElectionInstance.candidatesCount();
      })
      .then(function (candidatesCount) {
        for (var i = 1; i <= candidatesCount; i++) {
          ElectionInstance.candidates(i).then(function (candidate) {

              var id = candidate[0];
              var name = candidate[1];
              var voteCount = candidate[2];
              var candidateTemplate = "<div class='col-lg-4 col-sm-4'><div class='box_main'><h4 class='shirt_text'>"+ name +
                "</h4><p class='price_text'>"+voteCount  +
                  "<span style='color: #262626;'>표</span></p><div class='electronic_img'><img src='images/star_"+id+
                  ".png'></div><div class='btn_main' id='my_btn'><div onclick='btnvote123(" + id + ")' class='buy_bt' ><a href='#'>Vote"+
                       "</a></div><div class='seemore_bt'><a href='#'>See More</a></div></div></div></div>";
              $("#candidatesResults").append(candidateTemplate);

            });

        }
        $("#loader").hide();
        $("#content").show();
      })
      .catch(function (error) {
        console.warn(error);
      });
//candidate



//Rank 정보 읽기
      App.contracts.Election.deployed()
      .then(function (instance) {
        ElectionInstance = instance;
        return ElectionInstance.candidatesCount();
      })
      .then(function (candidatesCount) {
        for (var i = 1; i <= 3; i++) {
          // console.log(i+" out-----------------");
            ElectionInstance.ranks(i).then(function(rank){
              // console.log(i+" in-----------------");
              var id = rank[0];
              var name = rank[1];
              var voteCount = rank[2];
              var ranking =  "<div class='col-lg-4 col-sm-4'><div class='box_main'><h4 class='shirt_text'>"+
                name+"</h4><p class='price_text'>"+
                voteCount  +"<span style='color: #262626;'>표</span></p><div class='electronic_img'><img src='images/star_"+
                id+".png'></div></div> </div>";
             $("#Ranking1").append(ranking);
             $("#Ranking2").append(ranking);
             $("#Ranking3").append(ranking);


            });
          // console.log(i+" outoutoutoutoutout-----------------");

        }
        // for (var i = 4; i <= 6; i++) {
        //   // console.log(i+" out-----------------");
        //     ElectionInstance.ranks(i).then(function(rank){
        //       // console.log(i+" in-----------------");
        //       var id = rank[0];
        //       var name = rank[1];
        //       var voteCount = rank[2];
        //       var ranking =  "<div class='col-lg-4 col-sm-4'><div class='box_main'><h4 class='shirt_text'>"+
        //         name+"</h4><p class='price_text'>"+
        //         voteCount  +"<span style='color: #262626;'>표</span></p><div class='electronic_img'><img src='images/star_"+
        //         id+".png'></div></div> </div>";
        //      $("#Ranking2").append(ranking);

        //     });
        //   // console.log(i+" outoutoutoutoutout-----------------");

        // }
        // for (var i = 7; i <= candidatesCount; i++) {
        //   // console.log(i+" out-----------------");
        //     ElectionInstance.ranks(i).then(function(rank){
        //       // console.log(i+" in-----------------");
        //       var id = rank[0];
        //       var name = rank[1];
        //       var voteCount = rank[2];
        //       var ranking =  "<div class='col-lg-4 col-sm-4'><div class='box_main'><h4 class='shirt_text'>"+
        //         name+"</h4><p class='price_text'>"+
        //         voteCount  +"<span style='color: #262626;'>표</span></p><div class='electronic_img'><img src='images/star_"+
        //         id+".png'></div></div> </div>";
        //      $("#Ranking3").append(ranking);

        //     });
        //   // console.log(i+" outoutoutoutoutout-----------------");

        // }
        $("#loader").hide();
        $("#content").show();
      })
      .catch(function (error) {
        console.warn(error);
      });
//Rank

  }



  $('#btnVote').on('click', function () {
    var candidateId = $('#candidateSelect').val()
    if (!candidateId) {
      return alert('후보자를 선택하세요.')
    }
    App.contracts.Election.deployed()
      .then(function (instance) {
        //console.log("candidateId",candidateId);
        //console.log("app.account",App.account);
        return instance.vote(candidateId, { from: App.account })
      })
      .then(function (result) {
        if (result.receipt) {
          alert('성공적으로 투표했습니다.')
          location.reload();
        }
      })
      .catch(function (error) {
        alert(error.message)
      })
  })
});


function startTimer(){
  App.contracts.Election.deployed().then(function(instance){
      return instance.updateTime();
  })
}


function btnvote123(candidateId) {

  if (!candidateId) {
 
    return alert('후보자를 선택하세요.')
  }
  App.contracts.Election.deployed().then(function (instance) {
     
      return instance.vote(candidateId, { from: App.account })
    })
    .then(function (result) {
     
      if (result.receipt) {
       
        alert('성공적으로 투표했습니다.')
        location.reload();
      }
    })
    .catch(function (error) {
      
      alert(error.message)
    })
}


//-----------------------------------------------------------------------------------------------------------------------------------
function fieldsetDisable()  {
    console.log('this is Manager');
  
    const mybtn = document.getElementById('testbtn');//
    mybtn.disabled = true;
}