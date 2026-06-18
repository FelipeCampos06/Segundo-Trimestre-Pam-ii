export function createFooter() {
    return `
        <ion-footer>
            <ion-toolbar>
                <ion-button expand="block" id="btn-back-footer" style="--border-radius: 0;">
                    <ion-icon slot="start" name="arrow-back-outline"></ion-icon>
                    Voltar
                </ion-button>
            </ion-toolbar>
        </ion-footer>
    `;
}
