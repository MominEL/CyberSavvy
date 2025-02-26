var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

function preload() {
    this.load.image('background', '../assets/images/vault.png');
}

function create() {
    this.add.image(400, 300, 'background');
    var passwordInput = this.add.text(250, 400, 'Enter Password:', { fontSize: '20px', fill: '#fff' });

    var inputBox = document.createElement("input");
    inputBox.type = "password";
    inputBox.style.position = "absolute";
    inputBox.style.left = "350px";
    inputBox.style.top = "450px";
    document.body.appendChild(inputBox);

    var submitButton = this.add.text(350, 500, 'Submit', { fontSize: '20px', fill: '#0f0' })
        .setInteractive()
        .on('pointerdown', function () {
            var password = inputBox.value;
            if (password.length < 8) {
                passwordInput.setText('Too short! Try again.');
            } else {
                passwordInput.setText('Good password!');
            }
        });
}

function update() {
}
