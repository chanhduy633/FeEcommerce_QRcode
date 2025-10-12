UI      ->   State / ...    ->   Data từ remote / localStorage / socket
view         ViewModel           Model


data lấy từ remote: => instance => singleton
localstorage => instance => singleton
socket => instance => singleton

class Dependencies {

    remote
    localstorage
    socket

}

Model -> remote

Model -> localstore

Model -> Dependencies -> remote / storage / socket


API   -> Bussiness -> Model 
view     Controller   data từ remote / socket / database / ...

Class A extend B {
    contructor() {
        super();
    }
}

Dependencies {

    remoteA = new ...BussinessA.
    remoteB = new ...BussinessB
    bussinessA: = new BussiNessA(remoteA)
    ...
    bussinessC = new BussinessC(remoteA, remoteB)
}


class BussinessA {
    remoteA

    remoteA.getList()
}

class BussinessB {
    remoteB
}

class BussinessC {
    remoteA, 
    remoteB

    remoteA.getList() .....
}