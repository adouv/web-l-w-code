using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Windows.Media;

namespace MLPen.Helpers
{
    public class AudioHelper : IDisposable
    {
        private MediaPlayer player;
        private Action<AudioHelper> complateEvent;
        private Action<AudioHelper> playEvent;
        private static Dictionary<string, AudioHelper> mPlayer = new Dictionary<string, AudioHelper>();
        private Uri mFile;
        static AudioHelper()
        {
            mPlayer.Add("countdown-start", new AudioHelper(@"assets\audio\countdown-start.mp3"));
            mPlayer.Add("countdown-end", new AudioHelper(@"assets\audio\countdown-end.mp3"));
            mPlayer.Add("self-judgment-start", new AudioHelper(@"assets\audio\self-judgment-start.mp3"));
            mPlayer.Add("self-judgment-end", new AudioHelper(@"assets\audio\self-judgment-end.mp3"));
        }

        public AudioHelper(string file)
        {
            player = new MediaPlayer();
            player.Volume = 1;
            player.MediaOpened += (s, e) =>
            {
                playEvent?.Invoke(this);
            };
            player.MediaEnded += (s, e) =>
            {
                complateEvent?.Invoke(this);
                player.Close();
            };
            mFile = new Uri(file, UriKind.Relative);
        }
        ~AudioHelper()
        {
            this.Dispose();
        }
        public void Dispose()
        {
            GC.SuppressFinalize(this);
        }

        public static void Play(string key, Action<AudioHelper> onStart, Action<AudioHelper> onComplate)
        {
            if (!mPlayer.ContainsKey(key)) return;
            var helper = mPlayer[key];
            helper.playEvent = onStart;
            helper.complateEvent = onComplate;
            helper.Play();
        }
        public void Play()
        {
            player.Open(this.mFile);
            player.Play();
        }
    }
}
