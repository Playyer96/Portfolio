import RoadSafetyThumbnail from "../assets/Road-Safety_Enviroment.png";
import RoadSafetyBikePlatform from "../assets/Road-Safety_BikePlatformPhoto.png";
import RoadSafetyCarPlatform from "../assets/Road-Safety_CarPlatformPhoto.png";
import RoadSafetyEnvironment from "../assets/Road-Safety_Environment_2.png";
import SofasaThumbnail from "../assets/Sofasa_TakingPhotoMechanic.png";
import SofasaPickingTool from "../assets/Sofasa_PickingTool_1.png";
import SofasaPocketInteraction from "../assets/Sofasa_PocketInteraction.png";
import SofasaTrainingMode from "../assets/Sofasa_TrainingMode_1.png";
import SofasaTeleportMechanic from "../assets/Sofasa_TeleportMechanic.png";
import WorldVsThumbnail from "../assets/WorldVS_Menu.png";
import WorldVSCharacters from "../assets/WorldVS_Characters.png";
import WorldVSCharacterSelection from "../assets/WorldVS_CharacterSelection.png";
import WorldVsInGame from "../assets/WorldVS_In-Game.png";
import GlobalSickJamThumbnail from "../assets/Global-Sick-Jam_SplashScreen.png";
import GlobalSickJamCharacterSelection from "../assets/Global-Sick-Jam_CharacterSelection.png";
import GlobalSickJamEnd from "../assets/Global-Sick-Jam_End.png";
import GlobalSickJamInGame from "../assets/Global-Sick-Jam_InGame.png";
import SamsongThumbnail from "../assets/Samsong_1_1.png";
import SamsongAttack from "../assets/Samsong2_1.png";
import SamsongDeath from "../assets/Samsong3_1.png";
import ManikinLogo from "../assets/ManikinArena/Logo.png";
import ManekinArena from "../assets/ManikinArena/Arena.png";
import ManikinFighting from "../assets/ManikinArena/Fighthing.png";
import ManikinHelmet from "../assets/ManikinArena/Helmet.png";
import ManikinPersonalization from "../assets/ManikinArena/Personalization.png";
import ManikinCharacters from "../assets/ManikinArena/Characters.png";
import FSXProLogo from "../assets/FSXPro/1200x630wa.png";
import FSXProGreen from "../assets/FSXPro/643x0w.jpg";
import FSXProGreen_1 from "../assets/FSXPro/643x0w (1).jpg";
import FSCalibrationAppThumbnail from "../assets/FS-Calibration-app/GCHawk(1).jpg";
import FSCalibration_1 from "../assets/FS-Calibration-app/274099811-223e3a00-8ab8-4c43-947f-f02b8d341f61.png";
import FSCalibration_2 from "../assets/FS-Calibration-app/274099819-a2b0ca0f-982e-4e83-91ee-35485a345dbd.png";

export const ProjectList = [
    {
        id: 0,
        name: "FSX Pro",
        descriptions: [
            "Golf FSX Pro, the ultimate performance analysis tool for top-tier gamers, coaches, and club fitters. FSX Pro is a dedicated fitting and coaching platform by Foresight Sports, designed to enhance players' ability to tailor their data capture experience.",
        ],
        responsabilities: [
            "Collaborating with the team to develop a golf simulator experience using Unity.",
            "Implementing core gameplay mechanics, including player controls, swing mechanics, ball physics, and course interactions.",
            "Optimizing game performance for smooth gameplay.",
            "Participating in team discussions and providing insights for ticket estimation.",
            "Identifying areas of tech debt and promoting codebase maintainability and efficiency.",
            "Participating in code reviews to improve code quality and maintainability.",
            "Collaborating with the project manager to ensure project milestones and deadlines are met.",
            "Communicating with the team regarding technical srequirements and potential improvements.",
        ],
        image: FSXProLogo,
        images: [
            {id: "1", image: FSXProGreen},
            {id: "2", image: FSXProGreen_1},
        ],
        link: "https://www.foresightsports.com/pages/fsx-pro",
    },
    {
        id: 1,
        name: "Foresight Sports Calibration App",
        descriptions: [
            "Designed to enhance the precision and performance of wall-mounted golf simulators. This system provides a seamless solution for golf enthusiasts and professionals seeking accurate and realistic indoor golf experiences.",
        ],
        responsabilities: [
            "Collaborating with the team to develop a golf simulator experience using Unity.",
            "Implementing core gameplay mechanics, including player controls, swing mechanics, ball physics, and course interactions.",
            "Optimizing game performance for smooth gameplay.",
            "Participating in team discussions and providing insights for ticket estimation.",
            "Identifying areas of tech debt and promoting codebase maintainability and efficiency.",
            "Participating in code reviews to improve code quality and maintainability.",
            "Collaborating with the project manager to ensure project milestones and deadlines are met.",
            "Communicating with the team regarding technical srequirements and potential improvements.",
        ],
        image: FSCalibration_1,
        images: [
            {id: "1", image: FSCalibrationAppThumbnail},
            {id: "2", image: FSCalibration_1},
            {id: "3", image: FSCalibration_2},
        ],
        link: "https://www.foresightsports.com/",
    },
    {
        id: 2,
        name: "Manikins Arena",
        descriptions: [
            "Manikins RnT is a tactical video game, where players create a team of Manikins to take them into combat, whoever is last alive wins.\n",
            "Manikins obtain their skills and stats from the equipped Battle Relics, the Manikins by themselves are empty shelves.\n",
        ],
        responsabilities: [
            "Mechanics Developer",
            "Systems Developer",
            "Unit Testing",
        ],
        image: ManikinLogo,
        images: [
            {id: "1", image: ManekinArena},
            {id: "2", image: ManikinFighting},
            {id: "3", image: ManikinHelmet},
            {id: "4", image: ManikinPersonalization},
            {id: "5", image: ManikinCharacters},
        ],
        link: "https://manikins.io/",
        videoUrl: "https://www.youtube.com/watch?v=fFZBn1fA6Z4",
    },
    {
        id: 3,
        name: "Road Safety",
        image: RoadSafetyThumbnail,
        images: [
            {id: "1", image: RoadSafetyThumbnail},
            {id: "2", image: RoadSafetyBikePlatform},
            {id: "3", image: RoadSafetyCarPlatform},
            {id: "4", image: RoadSafetyEnvironment},
        ],
        descriptions: [
            "Virtual reality simulator that puts the player in an environment with a high accident rate to evaluate whether or not they meet road regulations.\n",
            "The built city recreates scenarios such as: run over in a school zone, not respecting a traffic light or stop and other specific cases for motorcycles and cars such as overtaking vehicles and zigzagging.\n",
        ],
        responsabilities: [
            "C++ Mechanics",
            "Blueprints Mechanics",
            "UI Programming",
            "Code Refactoring",
            "Asset Integration",
            "Game Optimization",
        ],
        link: "https://www.waygroupsa.com/experiencias/seguridad-vial/",
        videoUrl: "https://www.youtube.com/watch?v=VlTWb7iDvG4",
    },
    {
        id: 3,
        name: "Sofasa Logistica",
        image: SofasaThumbnail,
        images: [
            {id: "1", image: SofasaThumbnail},
            {id: "2", image: SofasaPickingTool},
            {id: "3", image: SofasaPocketInteraction},
            {id: "4", image: SofasaTeleportMechanic},
            {id: "5", image: SofasaTrainingMode},
        ],
        descriptions: [
            "Training simulators for Renault warehouse which is helping the company warehouse, improve the training sessions helping the employees learn faster get faster without interrupting the real environment.",
        ],
        responsabilities: [
            "Project Architecture",
            "Gameplay Mechanics",
            "UI Programming",
            "Api Conections",
            "Mechanics Adaptation for Hi5 GLoves And HTC Vive controllers",
            "Optimizations",
            "Asset Integration",
        ],
        videoUrl: "https://www.youtube.com/watch?v=VCh39-LcY_0",
    },
    {
        id: 4,
        name: "World VS",
        image: WorldVsThumbnail,
        images: [
            {id: "1", image: WorldVsThumbnail},
            {id: "2", image: WorldVSCharacterSelection},
            {id: "3", image: WorldVSCharacters},
            {id: "4", image: WorldVsInGame},
        ],
        descriptions: [
            "Fight for the honor of their universe. its a fight where the main characters from my classmates games fight each other and a textureless cube, because why not?",
        ],
        responsabilities: [
            "Gameplay Mechanics",
            "UI Programming",
            "Animation Programming",
            "Game Optimization",
            "Assets Integration",
        ],
        link: "https://drive.google.com/file/d/0ByINa44hUTosczFaVUN6UU1fdVU/view?resourcekey=0-GLe0J2U0q4elHkCBq7daww",
        videoUrl: "https://www.youtube.com/watch?v=RfvP-M4K2Pw",
    },
    {
        id: 5,
        name: "Global Sick Jam",
        image: GlobalSickJamThumbnail,
        images: [
            {id: "1", image: GlobalSickJamThumbnail},
            {id: "2", image: GlobalSickJamCharacterSelection},
            {id: "3", image: GlobalSickJamInGame},
            {id: "4", image: GlobalSickJamEnd},
        ],
        descriptions: [
            "This game was made in the global game jam 2018, which consists in transmitting diseases among the attendees of the GGJ event at the UPB Coliseum. Fighting game for 2-4 players. Multiple controllers support.",
        ],
        responsabilities: [
            "Map Interactions",
            "UI Programming",
            "Animation Programming",
            "Character Movements",
            "Enemies AI",
        ],
        link: "https://v3.globalgamejam.org/2018/games/global-sick-jam",
        videoUrl: "https://www.youtube.com/watch?v=AFJHzML7eeY",
    },
    {
        id: 6,
        name: "Samsong",
        image: SamsongThumbnail,
        images: [
            {id: "1", image: SamsongThumbnail},
            {id: "2", image: SamsongAttack},
            {id: "3", image: SamsongDeath},
        ],
        descriptions: [
            "Samsong the barbarian, must protect his cave from countless bats using the best weapon possible, his electric triangle.Game created in the Global Game jam 2017 Winner of the best use of Hardware Global Game Jam 2017 (U.P.B, Medellín, Colombia).",
        ],
        responsabilities: [
            "Gameplay Mechanics",
            "UI Programming",
            "Game Optimization",
            "AI Simple Movement",
            "Animation Programming",
        ],
        link: "https://v3.globalgamejam.org/2017/games/samsong",
        videoUrl: "https://www.youtube.com/embed/SNMrRji9Xwg?si=lqFH0d9m1wnCCfOv",
    },
];
