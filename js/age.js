document.addEventListener("DOMContentLoaded", () => {
    function calculateAge(birthDate) {
        const today = new Date();
        const birth = new Date(birthDate);

        let age = today.getFullYear() - birth.getFullYear();
        const monthDiff = today.getMonth() - birth.getMonth();

        if (
            monthDiff < 0 ||
            (monthDiff === 0 && today.getDate() < birth.getDate())
        ) {
            age--;
        }

        return age;
    }

    const ageElement = document.getElementById("age");

    if (ageElement) {
        ageElement.textContent = String(calculateAge("2003-09-26"));
    } else {
        console.error("Elemento con id='age' non trovato");
    }
});
